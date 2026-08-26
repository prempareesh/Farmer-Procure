import React from 'react';
import { Sprout, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1B4318] text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Info (2 cols wide on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#F9A825] border border-white/15">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block">
                  Agri<span className="text-[#F9A825]">Procure</span>
                </span>
                <span className="text-[11px] text-[#A5D6A7] font-medium">Procure Intelligence Platform</span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm font-medium">
              Predictive AI & trusted agricultural procurement platform built for Smart India Hackathon 2026. Empowering Indian farmers through queue forecasting, bottleneck elimination, and tamper-evident audit trails.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold border border-white/15">
                SIH 2026 Grand Finale Demo
              </span>
              <span className="px-3 py-1 rounded-full bg-[#F9A825]/20 text-[#F9A825] text-[11px] font-bold border border-[#F9A825]/30">
                SHA-256 Enabled
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs text-white/75 font-medium">
              <li><a href="#hero" className="hover:text-[#F9A825] transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-[#F9A825] transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-[#F9A825] transition-colors">How It Works</a></li>
              <li><a href="#dashboard" className="hover:text-[#F9A825] transition-colors">AI Control Dashboard</a></li>
              <li><a href="#about" className="hover:text-[#F9A825] transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-[#F9A825] transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Col 3: Key Features */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Capabilities</h4>
            <ul className="space-y-2 text-xs text-white/75 font-medium">
              <li><span>AI Queue Forecasting</span></li>
              <li><span>15-Min Smart Slot Tokens</span></li>
              <li><span>Weighing Bridge Telemetry</span></li>
              <li><span>Moisture Lab Bottleneck XAI</span></li>
              <li><span>SHA-256 Cryptographic Audit</span></li>
              <li><span>Multilingual WhatsApp Engine</span></li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Govt & Mandi Contact</h4>
            <ul className="space-y-2.5 text-xs text-white/75 font-medium">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F9A825] shrink-0 mt-0.5" />
                <span>Krishi Bhawan, New Delhi • SIH AgriTech Node</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F9A825] shrink-0" />
                <span>1800-PROCURE-AI (Toll-Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F9A825] shrink-0" />
                <span>support@procureintelligence.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 font-medium gap-4">
          <p>© 2026 PROCURE INTELLIGENCE. All Rights Reserved. Smart India Hackathon Grand Finale.</p>
          <div className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>for Indian Farmers</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
