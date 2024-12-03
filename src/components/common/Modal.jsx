import React from "react";
import { motion } from "framer-motion";

const Modal = ({ children, onClose }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <motion.div
        className='bg-gray-800 p-6 rounded-lg shadow-lg'
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button
          className='absolute top-2 right-2 text-gray-400 hover:text-gray-200'
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;
