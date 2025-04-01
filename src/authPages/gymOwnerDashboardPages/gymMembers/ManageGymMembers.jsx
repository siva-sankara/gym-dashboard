import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    FaUserPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaFilter,
    FaCheck,
    FaTimes,
    FaUser
} from 'react-icons/fa';
import './ManageGymMembers.css';
import { getUserById } from '../../../apis/apis';

const ManageGymMembers = () => {
    const { selectedGym } = useSelector((state) => state.gym);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);

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
    return (
        <div className="gym-member-management">
            <div className="gym-member-management__header">
                <h1>Manage Members</h1>
                <button className="gym-member-management__add-btn">
                    <FaUserPlus /> Add New Member
                </button>
            </div>

            <div className="gym-member-management__controls">
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
                            <th>Member Name</th>
                            <th>Membership Plan</th>
                            <th>Join Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map((member, index) => (
                            <tr key={index}>
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
                                        <FaUser /> Profile
                                    </button>
                                    <button className="gym-member-management__edit-btn">
                                        <FaEdit /> Edit
                                    </button>
                                    <button className="gym-member-management__delete-btn">
                                        <FaTrash /> Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
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
        </div>
    );
};

export default ManageGymMembers;