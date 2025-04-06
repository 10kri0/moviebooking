import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

function Aaboutus() {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
      };
    
      const scaleUp = {
        hidden: { scale: 0.95, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
      };
    
      // Animated border component
      const AnimatedBorder = () => (
        <motion.div 
          className="absolute inset-0 border-2 border-transparent rounded-xl"
          initial={{ borderColor: "rgba(255,65,108,0)" }}
          animate={{ 
            borderColor: [
              "rgba(255,65,108,0)",
              "rgba(255,65,108,0.3)",
              "rgba(255,65,108,0)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      );
    
      return (
        <>
          <Navbar />
          <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-black min-h-screen">
            {/* Hero Section */}
            <motion.section 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="relative bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white text-center py-16 rounded-xl mb-12 overflow-hidden"
            >
              <AnimatedBorder />
              <motion.h1 
                className="text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                About CineVerse
              </motion.h1>
              <motion.p 
                className="text-xl opacity-90 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.4 }}
              >
                Your premium platform for seamless movie ticket bookings
              </motion.p>
            </motion.section>
    
            {/* Mission Section */}
            <motion.section 
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center py-12 mb-12"
            >
              <div className="relative bg-[#111] p-8 rounded-xl shadow-lg border border-[#222] hover:shadow-[0_10px_25px_-5px_rgba(255,65,108,0.3)] transition-all duration-300">
                <AnimatedBorder />
                <h2 className="text-3xl font-bold text-[#ff416c] mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  At CineVerse, we believe in bringing the magic of cinema to your fingertips. 
                  With easy bookings, real-time seat selection, and exclusive offers, we make 
                  your movie experience unforgettable.
                </p>
              </div>
            </motion.section>
    
            {/* Team Section */}
            <section className="text-center py-8 mb-12">
              <motion.h2 
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
                viewport={{ once: true }}
                className="text-3xl font-bold text-[#ff416c] mb-12"
              >
                Meet the Team
              </motion.h2>
              <div className="flex flex-wrap justify-center gap-8">
                {/* Team Member 1 */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  variants={scaleUp}
                  viewport={{ once: true }}
                  className="relative bg-[#111] p-6 rounded-xl shadow-md hover:shadow-[0_8px_30px_rgba(255,65,108,0.2)] transition-all duration-300 w-72 border border-[#222]"
                >
                  <AnimatedBorder />
                  <motion.img 
                    src="https://i.ibb.co/HfZxnPts/IMG-20250328-WA0003.jpg" 
                    alt="Team Member" 
                    className="w-36 h-36 rounded-full mx-auto mb-4 object-cover border-2 border-[#ff416c]"
                    whileHover={{ scale: 1.05 }}
                  />
                  <h3 className="text-xl font-bold text-white">Krish Patel</h3>
                  <p className="text-[#ff416c] text-sm font-medium">Founder </p>
                  <p className="text-gray-400 mt-2 text-sm"></p>
                </motion.div>
                
                {/* Team Member 2 */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  variants={scaleUp}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="relative bg-[#111] p-6 rounded-xl shadow-md hover:shadow-[0_8px_30px_rgba(255,65,108,0.2)] transition-all duration-300 w-72 border border-[#222]"
                >
                  <AnimatedBorder />
                  <motion.img 
                    src="https://i.ibb.co/pjF45g0H/IMG-20250328-WA0005.jpg" 
                    alt="Team Member" 
                    className="w-36 h-36 rounded-full mx-auto mb-4 object-cover border-2 border-[#ff416c]"
                    whileHover={{ scale: 1.05 }}
                  />
                  <h3 className="text-xl font-bold text-white">Jayesh Patil</h3>
                  <p className="text-[#ff416c] text-sm font-medium">Lead Developer</p>
                  <p className="text-gray-400 mt-2 text-sm"></p>
                </motion.div>
                
                {/* Team Member 3 */}
                {/* <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  variants={scaleUp}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="relative bg-[#111] p-6 rounded-xl shadow-md hover:shadow-[0_8px_30px_rgba(255,65,108,0.2)] transition-all duration-300 w-72 border border-[#222]"
                >
                  <AnimatedBorder />
                  <motion.img 
                    src="https://randomuser.me/api/portraits/men/75.jpg" 
                    alt="Team Member" 
                    className="w-36 h-36 rounded-full mx-auto mb-4 object-cover border-2 border-[#ff416c]"
                    whileHover={{ scale: 1.05 }}
                  />
                  <h3 className="text-xl font-bold text-white">Mike Johnson</h3>
                  <p className="text-[#ff416c] text-sm font-medium">UX Designer</p>
                  <p className="text-gray-400 mt-2 text-sm">Creating beautiful, intuitive interfaces</p>
                </motion.div> */}
              </div>
            </section>
    
            {/* Contact CTA */}
            <motion.section 
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              className="relative bg-[#111] text-center py-12 rounded-xl shadow-md border border-[#222]"
            >
              <AnimatedBorder />
              <h2 className="text-3xl font-bold text-[#ff416c] mb-6">
                Have Questions?
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                We're here to help with anything movie-related!
              </p>
              <motion.a 
                href="mailto:support@movieflix.com" 
                className="inline-block bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white font-bold py-3 px-8 rounded-full hover:shadow-lg hover:shadow-[#ff416c]/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
               helpSupport.CineVerse.com
              </motion.a>
            </motion.section>
          </div>
        </>
      );
    };
    


export default Aaboutus