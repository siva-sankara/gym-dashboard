import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FaUserPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaFilter,
    FaCheck,
    FaTimes,
    FaUser,
    FaDownload
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import './ManageGymMembers.css';
import { deleteGymMember, getGymById, getUserById } from '../../../apis/apis';
import { setSelectedGym, updateGymMembers } from '../../../redux/slices/gymSlice';

const ManageGymMembers = () => {
    const { selectedGym } = useSelector((state) => state.gym);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    const dispatch = useDispatch();

    const filteredMembers = selectedGym?.members?.filter(member => {
        const memberName = member.user?.firstName || '';
        const matchesSearch = memberName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
        return matchesSearch && matchesFilter;
    }) || [];


    const calculateEndDate = (joinDate, endDate) => {
        if (endDate) return new Date(endDate).toLocaleDateString();
        const oneMonthFromJoin = new Date(joinDate);
        oneMonthFromJoin.setMonth(oneMonthFromJoin.getMonth() + 1);
        return oneMonthFromJoin.toLocaleDateString();
    };

    const handleShowProfile = async (member) => {
        setSelectedMember(member);
        setShowProfileModal(true);
        setLoading(true);
        try {
            const userData = await getUserById(member?.user?._id);
            setUserDetails(userData.data);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadMembersList = () => {
        const membersData = selectedGym?.members?.map((member, index) => ({
            'Sr. No.': index + 1,
            'Member Name': member.user?.firstName || 'N/A',
            'Email': member.user?.email || 'N/A',
            'Membership Plan': member.membershipPlan || 'N/A',
            'Join Date': new Date(member.joinDate).toLocaleDateString(),
            'End Date': calculateEndDate(member.joinDate, member.endDate),
            'Status': member.status || 'N/A',
            'Phone Number': member.user?.phoneNumber || 'N/A'
        })) || [];

        const ws = XLSX.utils.json_to_sheet(membersData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Members');

        const fileName = `gym_members_${new Date().toISOString().split('T')[0]}.xlsx`;

        XLSX.writeFile(wb, fileName);
    };

    const NoMembersMessage = () => (
        <tr>
            <td colSpan="6" style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#666',
                backgroundColor: '#f9f9f9'
            }}>
                <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    No Active Gym Members
                </div>
                <div style={{ fontSize: '0.9rem', color: '#888' }}>
                    There are currently no members registered in this gym.
                </div>
            </td>
        </tr>
    );

    const handleDeleteClick = (member) => {
        setMemberToDelete(member);
        setShowDeleteConfirmModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!memberToDelete || !selectedGym?.id) return;

        setDeleteLoading(true);
        try {
            await deleteGymMember(selectedGym.id, memberToDelete._id);
            const updatedGymData = await getGymById(selectedGym.id);
            dispatch(setSelectedGym({
                ...selectedGym,
                members: updatedGymData.data.members
            }));

            setShowDeleteConfirmModal(false);
            setMemberToDelete(null);
        } catch (error) {
            console.error('Failed to delete member:', error);
            // You might want to show an error message to the user here
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="gym-member-management">
            <div className="gym-member-management__header">
                <h1>Manage Members</h1>
                <div className="gym-member-management__header-buttons">
                    <button className="gym-member-management__add-btn">
                        <FaUserPlus /> Add New Member
                    </button>
                    <button
                        className="gym-member-management__download-btn"
                        onClick={downloadMembersList}
                        disabled={!filteredMembers.length}
                    >
                        <FaDownload /> Export to Excel
                    </button>
                </div>
            </div>

            <div className="gym-member-hy7jmanagement__controls">
                <div className="gym-member-management__search">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="gym-member-management__filter">
                    <FaFilter />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Members</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            <div className="gym-member-management__table-wrapper">
                <table className="gym-member-management__table">
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Member Name</th>
                            <th>Membership Plan</th>
                            <th>Join Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.length === 0 ? (
                            <NoMembersMessage />
                        ) : (
                            filteredMembers.map((member, index) => (
                                <tr key={`${member._id}-${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{member.user?.firstName || 'N/A'}</td>
                                    <td>{member.membershipPlan}</td>
                                    <td>{new Date(member.joinDate).toLocaleDateString()}</td>
                                    <td>{calculateEndDate(member.joinDate, member.endDate)}</td>
                                    <td>
                                        <span className={`gym-member-management__status-badge gym-member-management__status-badge--${member.status}`}>
                                            {member.status === 'active' ? <FaCheck /> : <FaTimes />}
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="gym-member-management__actions">
                                        <button
                                            className="gym-member-management__profile-btn"
                                            onClick={() => handleShowProfile(member)}
                                        >
                                            <FaUser /> <p className='text-hide'>Profile</p>
                                        </button>
                                        <button className="gym-member-management__edit-btn">
                                            <FaEdit /><p className='text-hide'>Edit</p>
                                        </button>
                                        <button
                                            className="gym-member-management__delete-btn"
                                            onClick={() => handleDeleteClick(member)}
                                            disabled={deleteLoading}
                                        >
                                            <FaTrash /> <p className='text-hide'>{deleteLoading ? 'Deleting...' : 'Remove'}</p>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showProfileModal && selectedMember && (
                <div className="gym-member-management__modal-overlay">
                    <div className="gym-member-management__modal">
                        <div className="gym-member-management__modal-header">
                            <h2>Member Profile</h2>
                            <button
                                className="gym-member-management__modal-close"
                                onClick={() => {
                                    setShowProfileModal(false);
                                    setUserDetails(null);
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="gym-member-management__modal-content">
                            {loading ? (
                                <div className="gym-member-management__loading">Loading...</div>
                            ) : (
                                <div className="gym-member-management__profile-info">
                                    <h3>Personal Information</h3>
                                    <p><strong>Name:</strong> {userDetails?.firstName || 'N/A'}</p>
                                    <p><strong>Email:</strong> {userDetails?.email || 'N/A'}</p>
                                    <p><strong>Phone:</strong> {userDetails?.phoneNumber || 'N/A'}</p>
                                    <p><strong>Role:</strong> {userDetails?.role?.replace('_', ' ').toUpperCase() || 'N/A'}</p>
                                    <p><strong>Account Status:</strong> {userDetails?.isActive ? 'Active' : 'Inactive'}</p>

                                    <h3>Membership Details</h3>
                                    <p><strong>Join Date:</strong> {new Date(selectedMember.joinDate).toLocaleDateString()}</p>
                                    <p><strong>End Date:</strong> {calculateEndDate(selectedMember.joinDate, selectedMember.endDate)}</p>
                                    <p><strong>Status:</strong> {selectedMember.status}</p>
                                    <p><strong>Membership Plan:</strong> {selectedMember.membershipPlan}</p>

                                    {userDetails?.healthInfo && (
                                        <div>
                                            <h3>Health Information</h3>
                                            <p><strong>Medical Conditions:</strong> {userDetails.healthInfo.medicalConditions?.length ?
                                                userDetails.healthInfo.medicalConditions.join(', ') : 'None reported'}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirmModal && (
                <div className="gym-member-management__modal-overlay">
                    <div className="gym-member-management__modal">
                        <div className="gym-member-management__modal-header">
                            <h2>Confirm Deletion</h2>
                        </div>
                        <div className="gym-member-management__modal-content">
                            <b><p>Are you sure you want to remove this member?</p></b>
                            <p><b>Member Name: </b>{memberToDelete?.user?.firstName || 'N/A'}</p>
                            <p style={{color:"gray"}}>This action cannot be undone.</p>
                        </div>
                        <div className="gym-member-management__modal-footer">
                            <button
                                className="gym-member-management__modal-btn gym-member-management__modal-btn--cancel"
                                onClick={() => {
                                    setShowDeleteConfirmModal(false);
                                    setMemberToDelete(null);
                                }}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="gym-member-management__modal-btn gym-member-management__modal-btn--delete"
                                onClick={handleDeleteConfirm}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageGymMembers;