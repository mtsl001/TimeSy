'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Github, Twitter, Coffee, Users, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function Footer() {
  const [showDonation, setShowDonation] = useState(false);

  const handleDonate = () => {
    // In a real app, this would open a payment link
    toast.success('Thank you for your support! 🎉');
    setShowDonation(false);
  };

  const handleSocialClick = (platform: string) => {
    toast.info(`Follow us on ${platform}!`);
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <h3 className="text-lg font-semibold">Time Synx</h3>
            </div>
            <p className="text-slate-400 text-sm">
              The ultimate timezone coordination tool for global teams. 
              Schedule meetings across timezones with ease.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Free Forever</Badge>
              <Badge variant="secondary" className="text-xs">No Ads</Badge>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-200">Features</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" />
                Real-time synchronization
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                Multi-timezone support
              </li>
              <li className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-blue-400" />
                Meeting planner
              </li>
              <li className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-blue-400" />
                Weather integration
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-200">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Newsletter & Donation */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-200">Stay Connected</h4>
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Get updates and new features delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialClick('GitHub')}
                className="text-slate-400 border-slate-700 hover:text-white hover:border-slate-600"
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialClick('Twitter')}
                className="text-slate-400 border-slate-700 hover:text-white hover:border-slate-600"
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Donation Banner */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-red-500" />
              <div>
                <h3 className="font-semibold text-white">Love Time Synx?</h3>
                <p className="text-sm text-slate-300">
                  Help us keep this tool free and ad-free for everyone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDonation(!showDonation)}
                className="border-slate-600 hover:bg-slate-800"
              >
                Learn More
              </Button>
              <Button
                onClick={handleDonate}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Heart className="h-4 w-4 mr-2" />
                Donate Now
              </Button>
            </div>
          </div>
          
          {showDonation && (
            <div className="mt-4 pt-4 border-t border-blue-500/30">
              <p className="text-sm text-slate-300 mb-3">
                Your donation helps us maintain servers, add new features, and keep Time Synx free for thousands of users worldwide.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['$5', '$10', '$25', '$50'].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={handleDonate}
                    className="border-slate-600 hover:bg-slate-800"
                  >
                    {amount}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-400">
            © 2024 Time Synx. Made with <Heart className="h-3 w-3 text-red-500 inline" /> for global teams.
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}