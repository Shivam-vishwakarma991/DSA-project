import { motion } from 'framer-motion';
import { User } from '@/types';
import { 
  SparklesIcon, 
  BoltIcon, 
  FireIcon,
  TrophyIcon 
} from '@heroicons/react/24/outline';

interface DashboardHeaderProps {
  user: User | null;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalQuote = () => {
    const quotes = [
      { text: "Every expert was once a beginner", icon: SparklesIcon },
      { text: "Consistency is the key to mastery", icon: BoltIcon },
      { text: "Your only limit is you", icon: FireIcon },
      { text: "Progress, not perfection", icon: TrophyIcon },
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const quote = getMotivationalQuote();
  const Icon = quote.icon;

  return (
    <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Greeting */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {getGreeting()}, {user?.fullName?.split(' ')[0]}! 👋
              </h1>
              <p className="text-white/90 mt-1">
                Ready to solve some problems today?
              </p>
            </div>
            
            {/* Today's Date */}
            <div className="text-right">
              <p className="text-white/80 text-sm">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3"
          >
            <Icon className="h-6 w-6 text-yellow-300" />
            <p className="text-white/95 font-medium italic">
              "{quote.text}"
            </p>
          </motion.div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Streak', value: user?.stats.streak || 0, suffix: ' days', color: 'text-orange-300' },
              { label: 'Solved Today', value: 0, suffix: '', color: 'text-green-300' },
              { label: 'Total Solved', value: user?.stats.totalSolved || 0, suffix: '', color: 'text-blue-300' },
              { label: 'Rank', value: '#42', suffix: '', color: 'text-purple-300' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3"
              >
                <p className="text-white/70 text-xs uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}{stat.suffix}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}