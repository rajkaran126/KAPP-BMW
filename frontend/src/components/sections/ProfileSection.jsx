import { ICONS, Icon, SectionHeader } from '../shared/UIComponents';

export default function ProfileSection({ user, onUpdateUser }) {
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => { onUpdateUser({ avatar: reader.result }); };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <SectionHeader title="My Profile" subtitle="Manage your account" />
            <div className="flex gap-8 items-start">
                {/* Avatar Card */}
                <div className="p-8 rounded-2xl flex flex-col items-center gap-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500/30 bg-gray-800 relative shadow-2xl">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900/50">
                                <Icon path={ICONS.user} size={64} />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <label className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20">
                            <Icon path={ICONS.edit} size={16} />
                            Upload Photo
                            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                        </label>
                        {user.avatar && (
                            <button onClick={() => onUpdateUser({ avatar: null })}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-semibold transition-colors border border-red-500/20">
                                <Icon path={ICONS.trash} size={16} />
                                Remove Photo
                            </button>
                        )}
                    </div>
                </div>

                {/* Details Card */}
                <div className="flex-1 p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><Icon path={ICONS.user} size={20} /></div>
                        Account Details
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                            <input
                                value={user.name}
                                onChange={e => onUpdateUser({ name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Role</label>
                            <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium cursor-not-allowed opacity-70">
                                {user.role}
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Username</label>
                            <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium cursor-not-allowed opacity-70">
                                {user.username}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-sm text-gray-500">
                            Member since <span className="text-gray-300">February 2026</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
