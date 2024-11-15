import { motion } from "framer-motion";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gray-800 p-6 rounded-lg shadow-lg text-white"
			>
				<h2 className="text-lg font-semibold mb-4">Delete Confirmation</h2>
				<p>Are you sure you want to delete "{itemName}"?</p>
				<div className="mt-6 flex justify-end gap-4">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
					>
						Delete
					</button>
				</div>
			</motion.div>
		</div>
	);
};

export default DeleteConfirmationModal;
