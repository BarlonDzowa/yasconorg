
import React from "react";

export default function Mission() {
  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#1a2e1a] text-white p-5 rounded-sm">
          <h4 className="text-sm font-bold uppercase tracking-widest text-[#d4a017] mb-2">
            Our Mission
          </h4>
          <p className="text-xs text-white/75 leading-relaxed">
            To mobilize Malawian youth in grassroots environmental conservation and sustainable development.
          </p>
        </div>
        <div className="bg-[#f7f3ea] border border-[#ede8d8] p-5 rounded-sm">
          <h4 className="text-sm font-bold uppercase tracking-widest text-[#1a2e1a] mb-2">
            Our Vision
          </h4>
          <p className="text-xs text-[#4a5a4a] leading-relaxed">
            A Malawi where every young person is an active champion of conservation and environmental justice.
          </p>
        </div>
      </div>
    </div>
  );
}
