import { motion } from 'framer-motion'

export default function Loader3D({ size = 'md', text = '' }) {
  const sizeMap = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' }
  const innerSize = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-7 h-7' }
  const s = sizeMap[size] || sizeMap.md
  const ism = innerSize[size] || innerSize.md

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative perspective-800">
        {/* 3D Cube Spinner */}
        <motion.div
          className={`${s} relative`}
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          {['bg-cinema-red/80', 'bg-blue-500/80', 'bg-green-500/80', 'bg-yellow-500/80', 'bg-purple-500/80', 'bg-pink-500/80'].map((color, i) => (
            <div
              key={i}
              className={`absolute ${ism} ${color} rounded-md`}
              style={{
                transform: i === 0 ? 'translateZ(calc(var(--s) / 2))' :
                           i === 1 ? 'translateZ(calc(var(--s) / -2))' :
                           i === 2 ? 'rotateY(90deg) translateZ(calc(var(--s) / 2))' :
                           i === 3 ? 'rotateY(90deg) translateZ(calc(var(--s) / -2))' :
                           i === 4 ? 'rotateX(90deg) translateZ(calc(var(--s) / 2))' :
                                    'rotateX(90deg) translateZ(calc(var(--s) / -2))',
                boxShadow: '0 0 12px rgba(229,9,20,0.3)',
              }}
            />
          ))}
        </motion.div>

        {/* Glow ring */}
        <motion.div
          className={`absolute inset-0 ${s} rounded-full`}
          style={{
            background: 'radial-gradient(circle, rgba(229,9,20,0.15) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Orbiting dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-cinema-red"
            animate={{ y: [-4, 4, -4], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>

      {text && <p className="text-gray-500 text-xs animate-pulse">{text}</p>}
    </div>
  )
}
