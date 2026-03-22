'use client';

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { X, Search, UserPlus, Shield } from "lucide-react";

interface RoomMembersPanelProps {
  roomId: Id<"rooms">;
  currentUserId: Id<"users">;
  onClose: () => void;
}

export default function RoomMembersPanel({ roomId, currentUserId, onClose }: RoomMembersPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const members = useQuery(api.rooms.getRoomMembers, { roomId });
  const allUsers = useQuery(api.users.getAllUsers);
  const addMember = useMutation(api.rooms.addMember);
  const removeMember = useMutation(api.rooms.removeMember);

  if (!members) return null;

  const currentUser = members.find(m => m._id === currentUserId);
  const isAdmin = currentUser?.isAdmin || false;

  const nonMembers = allUsers?.filter(user => 
    !members.some(m => m._id === user._id) &&
    (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const handleAddMember = async (userId: Id<"users">) => {
    try {
      await addMember({ roomId, userId });
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  const handleRemoveMember = async (userId: Id<"users">) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeMember({ roomId, userId });
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

  return (
    <div style={{
      width: '220px',
      height: '100%',
      backgroundColor: '#0d0d0d',
      borderLeft: '1px solid #141414',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(240,237,230,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--obsidian-text)' }}>Members</span>
          <span style={{ fontSize: '11px', color: 'var(--obsidian-text-muted)' }}>{members.length}</span>
        </div>
        <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--obsidian-text-muted)', cursor: 'pointer', padding: '4px' }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Member List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {members.map(member => (
          <div 
            key={member._id}
            className="member-row"
            style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={member.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} 
                  alt={member.name || "User"}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                {member.presence === 'online' && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#22c55e',
                    border: '2px solid #0d0d0d'
                  }} />
                )}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--obsidian-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {member.name}
                  </span>
                  {member.isAdmin && (
                    <span style={{
                      backgroundColor: 'rgba(201,168,76,0.1)',
                      color: '#c9a84c',
                      border: '1px solid rgba(201,168,76,0.2)',
                      borderRadius: '4px',
                      fontSize: '9px',
                      padding: '1px 6px',
                      fontFamily: 'monospace',
                      textTransform: 'uppercase',
                    }}>
                      Admin
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--obsidian-text-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {member.email}
                </div>
              </div>
            </div>
            
            {isAdmin && member._id !== currentUserId && (
              <button
                className="remove-btn"
                onClick={() => handleRemoveMember(member._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'none',
                }}
              >
                <X size={14} />
              </button>
            )}
            <style jsx>{`
              .member-row:hover .remove-btn {
                display: flex !important;
              }
              .member-row:hover .remove-btn:hover {
                color: #f87171 !important;
              }
              .member-row:hover {
                background: rgba(255,255,255,0.03);
              }
            `}</style>
          </div>
        ))}

        {isAdmin && (
          <>
            <div style={{ height: '1px', background: 'rgba(240,237,230,0.05)', margin: '16px 16px' }} />
            <div style={{ padding: '0 16px 8px' }}>
              <div style={{ fontSize: '10px', color: 'var(--obsidian-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Add Member
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(240,237,230,0.1)',
                borderRadius: '6px',
                padding: '4px 8px',
                marginBottom: '12px'
              }}>
                <Search size={12} style={{ color: 'var(--obsidian-text-muted)' }} />
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter users..."
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--obsidian-text)',
                    fontSize: '11px',
                    outline: 'none',
                    width: '100%',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {nonMembers.map(user => (
                <div 
                  key={user._id}
                  style={{
                    padding: '6px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <img 
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                      alt={user.name || "User"}
                      style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '12px', color: 'var(--obsidian-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--obsidian-text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddMember(user._id)}
                    style={{
                      background: 'rgba(240,237,230,0.05)',
                      border: '1px solid rgba(240,237,230,0.1)',
                      borderRadius: '4px',
                      color: 'var(--obsidian-text)',
                      fontSize: '10px',
                      padding: '2px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    Add
                  </button>
                </div>
              ))}
              {nonMembers.length === 0 && searchQuery && (
                <div style={{ padding: '0 16px', fontSize: '11px', color: 'var(--obsidian-text-muted)', fontStyle: 'italic' }}>
                  No users found
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
