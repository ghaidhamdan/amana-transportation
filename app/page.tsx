'use client';

import React, { useState } from 'react';
import BusMap from './components/BusMap';
import busDataJson from './data/busData.json'; // حفظ الـ JSON في ملف محلي أو جلبه من API

export default function HomePage() {
  const [selectedBusId, setSelectedBusId] = useState(busDataJson.bus_lines[0].id);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSchedule, setIsOpenSchedule] = useState(false);

  const buses = busDataJson.bus_lines;
  const selectedBus = buses.find(bus => bus.id === selectedBusId)!;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 flex justify-between items-center px-6 py-4 shadow-sm">
        <div className="font-semibold text-lg text-green-700">{busDataJson.company_info.name}</div>
        <button className="px-3 py-1 text-sm rounded-md bg-green-100 hover:bg-green-200 text-green-700 transition">
          Menu
        </button>
      </header>

      {/* Title */}
      <section className="text-center mt-8">
        <h1 className="text-3xl font-bold text-green-700">Active Bus Tracking</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time route tracking and schedule overview</p>
      </section>

      {/* Dropdown Select Bus */}
      <section className="mt-8 flex flex-col items-center gap-2 relative z-[1000]">
        <label className="text-gray-700 font-medium text-sm tracking-wide">Choose Active Bus</label>
        <div className="relative w-64">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-white border border-green-300 rounded-full px-4 py-2 flex justify-between items-center text-sm text-gray-700 shadow-sm hover:shadow-md transition"
          >
            {selectedBus.name}
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute top-12 left-0 w-full bg-white rounded-2xl border border-green-200 shadow-lg py-2 z-20 animate-fadeIn">
              {buses.map(bus => (
                <button
                  key={bus.id}
                  onClick={() => {
                    setSelectedBusId(bus.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm rounded-full transition-all duration-150 ${
                    bus.id === selectedBusId ? 'bg-green-100 text-green-700 font-medium' : 'hover:bg-green-50 text-gray-700'
                  }`}
                >
                  {bus.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200 mt-4 p-6">
        <h2 className="text-lg font-semibold text-green-700 mb-3">{selectedBus.name} Route Map</h2>
        <div className="rounded-lg overflow-hidden border border-gray-100 shadow-inner">
          <BusMap busData={selectedBus} />
        </div>
      </section>

      {/* Schedule Section */}
      <section className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200 mt-8 p-6">
        <h2 className="text-lg font-semibold text-green-700 mb-4 text-center">Bus Schedule</h2>
        <table className="w-full text-sm border-collapse border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="border border-gray-200 px-3 py-2 text-left">Bus Stop</th>
              <th className="border border-gray-200 px-3 py-2 text-left">Next Arrival</th>
            </tr>
          </thead>
          <tbody>
            {selectedBus.bus_stops.map(stop => (
              <tr key={stop.id} className="hover:bg-green-50 transition border-t border-gray-200">
                <td className="px-3 py-2">{stop.name}</td>
                <td className="px-3 py-2">{stop.estimated_arrival}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

{/* 📊 Combined Info Section */}
<section className="w-full max-w-6xl mt-10 mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
  
  {/* 🧍 Active Drivers */}
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
    <h2 className="text-lg font-semibold text-green-700 mb-4 text-center">
      Active Drivers
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[350px] pr-2">
      {buses
        .filter(bus => bus.status === 'Active')
        .map(bus => (
          <div
            key={bus.id}
            className="bg-green-50 border border-green-100 p-4 rounded-xl shadow-sm hover:shadow-md transition transform hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-200 text-green-800 w-10 h-10 flex items-center justify-center rounded-full font-bold">
                {bus.driver.name[0]}
              </div>
              <div>
                <h3 className="text-green-800 font-semibold text-sm">{bus.driver.name}</h3>
                <p className="text-gray-600 text-xs">{bus.name}</p>
              </div>
            </div>
            <div className="text-gray-600 text-xs mt-2">
              <p>🕒 Shift: {bus.driver.shift_start} - {bus.driver.shift_end}</p>
              <p>🚍 Passengers: {bus.passengers.current}/{bus.passengers.capacity}</p>
            </div>
          </div>
        ))}
    </div>
  </div>

  {/* 🕒 Recent Trips */}
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
    <h2 className="text-lg font-semibold text-green-700 mb-4 text-center">
      Recent Trips
    </h2>
    <div className="overflow-y-auto max-h-[350px]">
      <table className="w-full text-sm border-collapse border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-green-100 text-green-800 sticky top-0">
          <tr>
            <th className="border border-gray-200 px-3 py-2 text-left">Route</th>
            <th className="border border-gray-200 px-3 py-2 text-left">Driver</th>
            <th className="border border-gray-200 px-3 py-2 text-left">Distance (km)</th>
            <th className="border border-gray-200 px-3 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {buses.slice(0, 5).map(bus => (
            <tr
              key={bus.id}
              className="hover:bg-green-50 transition border-t border-gray-200"
            >
              <td className="px-3 py-2">{bus.name}</td>
              <td className="px-3 py-2">{bus.driver.name}</td>
              <td className="px-3 py-2">{bus.route_info.total_distance}</td>
              <td className="px-3 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bus.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : bus.status === 'Maintenance'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {bus.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

</section>

    </main>
  );
}
