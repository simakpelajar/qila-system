import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Edit, Trash } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Api from "../../api";
import Popup from "reactjs-popup";
import ReactPaginate from "react-paginate";

const UsersTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const usersPerPage = 5;


    const fetchUsers = async () => {
        try {
            const response = await Api.get('/get-user');
            console.log("API response:", response);
            const data = response.data.data;

            if (Array.isArray(data)) {
                const usersWithRoles = data
                    .filter((user) => user.email !== "superadmin@gmail.com") 
                    .map((user) => ({
                        ...user,
                        role: "Student",
                        status: "Active",
                    }));
                setUsers(usersWithRoles);
                setFilteredUsers(usersWithRoles);
            } else {
                console.error("Unexpected data format", data);
                toast.error("Failed to fetch users.");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);


    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = users.filter(
            (user) =>
                user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
    };


    const indexOfLastUser = (currentPage + 1) * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle delete user
    const handleDelete = async (userId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            customClass: {
                confirmButton: 'swal-custom-cursor',
                cancelButton: 'swal-custom-cursor',
            },
        });
    
        if (result.isConfirmed) {
            try {
                await Api.delete(`/get-user/${userId}`);
                setUsers(users.filter(user => user.id !== userId));
                setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
                toast.success(`User deleted`, {
                    position: "top-right",
                    autoClose: 1500,
                });
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user.");
            }
        }
    };


    const handleUpdate = (user) => {
        setSelectedUser(user);
    };

    const handleSubmitUpdate = async (updatedUser) => {
        try {
            const response = await Api.put(`/get-user/${updatedUser.id}`, updatedUser); // Await untuk operasi async
            setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
            setFilteredUsers(filteredUsers.map(user => user.id === updatedUser.id ? updatedUser : user));
            toast.success(`User updated successfully!`, {
                position: "top-right",
                autoClose: 1500,
            });
            setSelectedUser(null); // Tutup modal
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user.");
        }
    };
    
    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Users</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700">
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                                                    {user.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-100">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-300">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.status === "Active"
                                                    ? "bg-green-800 text-green-100"
                                                    : "bg-red-800 text-red-100"
                                            }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        <button
                                            onClick={() => handleUpdate(user)}
                                            className="text-indigo-400 hover:text-indigo-600 mr-3"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                             <Trash size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody> 	
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center">
    <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={Math.ceil(filteredUsers.length / usersPerPage)}
        onPageChange={({ selected }) => paginate(selected)}
        containerClassName={"flex items-center gap-2"}
        pageClassName={"page-item px-3 py-1 bg-gray-700 hover:bg-blue-500 rounded-lg text-white"}
        pageLinkClassName={"text-gray-300"}
        previousClassName={"px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600"}
        previousLinkClassName={"text-gray-300"}
        nextClassName={"px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600"}
        nextLinkClassName={"text-gray-300"}
        disabledClassName={"opacity-50"}
        activeClassName={"!bg-blue-500"}
    />
</div>

      {/* Edit Popup */}
	  <Popup open={selectedUser !== null} closeOnDocumentClick onClose={() => setSelectedUser(null)}>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl text-white font-semibold mb-4">Edit User</h2>
                    {selectedUser && (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmitUpdate({
                                ...selectedUser,
                                name: e.target.name.value,
                                email: e.target.email.value,
                                role: e.target.role.value,
                                status: e.target.status.value,
                            });
                        }}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={selectedUser.name}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={selectedUser.email}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    defaultValue={selectedUser.role}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300">Status</label>
                                <select
                                    name="status"
                                    defaultValue={selectedUser.status}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500"
                            >
                                Save Changes
                            </button>
                        </form>
                    )}
                </div>
            </Popup>

        </motion.div>
    );
};

export default UsersTable;
