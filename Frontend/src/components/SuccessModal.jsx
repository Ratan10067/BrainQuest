import { motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

export default function SuccessModal({ message, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 10, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-lg 
                   rounded-2xl border border-green-500/30 p-8 max-w-md w-full shadow-2xl
                   shadow-green-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button (top-right corner) */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </motion.button>

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Animated checkmark circle */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center
                       border border-green-500/20"
          >
            <CheckCircle
              className="w-10 h-10 text-green-400"
              strokeWidth={1.5}
            />
          </motion.div>

          {/* Message with subtle animation */}
          <motion.h3
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-2xl font-bold text-white leading-tight"
          >
            {message}
          </motion.h3>

          {/* Action button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full pt-2"
          >
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 15px rgba(74, 222, 128, 0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 
                         text-white font-medium rounded-xl hover:shadow-lg transition-all
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                         focus:ring-offset-slate-900"
            >
              Continue
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
