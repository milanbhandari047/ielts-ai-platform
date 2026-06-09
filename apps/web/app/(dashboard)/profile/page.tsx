"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService } from "@/services/dashboard.service";
import api from "@/lib/axios";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { changePassword, isLoading } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [targetBand, setTargetBand] = useState(
    user?.targetBand?.toString() ?? "7"
  );
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [goalBand, setGoalBand] = useState("7");
  const [goalDate, setGoalDate] = useState("");
  const [goalMins, setGoalMins] = useState("60");
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [goalMsg, setGoalMsg] = useState("");

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await api.patch("/users/me", {
        name,
        targetBand: parseFloat(targetBand),
      });
      if (res.data.success && user) {
        setUser({
          ...user,
          name: res.data.data.name,
          targetBand: res.data.data.targetBand,
        });
        setProfileMsg("Profile saved!");
      }
    } catch {
      setProfileMsg("Failed to save profile.");
    } finally {
      setIsSavingProfile(false);
      setTimeout(() => setProfileMsg(""), 3000);
    }
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalDate) {
      setGoalMsg("Please set a target date.");
      return;
    }
    setIsSavingGoal(true);
    try {
      await dashboardService.setStudyGoal({
        targetBand: parseFloat(goalBand),
        targetDate: goalDate,
        dailyMinutes: parseInt(goalMins),
      });
      setGoalMsg("Study goal saved!");
    } catch {
      setGoalMsg("Failed to save goal.");
    } finally {
      setIsSavingGoal(false);
      setTimeout(() => setGoalMsg(""), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await changePassword({
      currentPassword: currentPw,
      newPassword: newPw,
    });
    if (result) {
      setPwMsg("Password changed. Please log in again.");
    } else {
      setPwMsg("Failed. Check your current password.");
    }
    setCurrentPw("");
    setNewPw("");
    setTimeout(() => setPwMsg(""), 4000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      {/* Avatar + basic info */}
      <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              user?.emailVerified
                ? "bg-green-50 text-green-700"
                : "bg-yellow-50 text-yellow-700"
            }`}
          >
            {user?.emailVerified ? "✓ Email verified" : "⚠ Email not verified"}
          </span>
        </div>
      </div>

      {/* Edit profile */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-4"
      >
        <h2 className="text-sm font-semibold text-gray-900">Edit Profile</h2>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Target Band Score
          </label>
          <select
            value={targetBand}
            onChange={(e) => setTargetBand(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
          >
            {["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"].map((b) => (
              <option key={b} value={b}>
                Band {b}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSavingProfile}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSavingProfile ? "Saving…" : "Save Profile"}
          </button>
          {profileMsg && <p className="text-sm text-green-600">{profileMsg}</p>}
        </div>
      </form>

      {/* Study goal */}
      <form
        onSubmit={handleSaveGoal}
        className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-4"
      >
        <h2 className="text-sm font-semibold text-gray-900">Study Goal</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Target Band
            </label>
            <select
              value={goalBand}
              onChange={(e) => setGoalBand(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
            >
              {["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"].map(
                (b) => (
                  <option key={b} value={b}>
                    Band {b}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Target Date
            </label>
            <input
              type="date"
              value={goalDate}
              onChange={(e) => setGoalDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Daily Minutes
            </label>
            <select
              value={goalMins}
              onChange={(e) => setGoalMins(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
            >
              {["30", "60", "90", "120"].map((m) => (
                <option key={m} value={m}>
                  {m} min
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSavingGoal}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSavingGoal ? "Saving…" : "Save Goal"}
          </button>
          {goalMsg && <p className="text-sm text-green-600">{goalMsg}</p>}
        </div>
      </form>

      {/* Change password */}
      {!user?.role && (
        <form
          onSubmit={handleChangePassword}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-4"
        >
          <h2 className="text-sm font-semibold text-gray-900">
            Change Password
          </h2>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Current Password
            </label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              New Password
            </label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isLoading ? "Changing…" : "Change Password"}
            </button>
            {pwMsg && <p className="text-sm text-red-600">{pwMsg}</p>}
          </div>
        </form>
      )}
    </div>
  );
}
