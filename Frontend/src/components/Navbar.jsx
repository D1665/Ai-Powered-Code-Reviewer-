
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
function Navbar() {
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

    return (
        <nav className="bg-zinc-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center pl-4">
                {/* Brand */}
                <div style={{ paddingLeft: "40px" }} className="text-2xl font-bold tracking-wide pl-8">
                    AI Powered Code Reviewer
                </div>

                {/* Right Side - Welcome + Logout */}
                <div className="flex items-center gap-8 ml-auto pr-0">
                    <ul className="flex flex-row items-center gap-4">
                        <li>
                            <span className="text-sm text-gray-300">Welcome,</span>
                        </li>

                        {isAuthenticated && (
                            <>
                                <li>
                                    <h2 className="text-sm text-white">{user.name}</h2>
                                </li>
                                <li>
                                    <img src={user.picture} alt="User" className="w-8 h-8 rounded-full" />
                                </li>
                                
                            </>
                        )}

                        <li>
                            {isAuthenticated ? (
                                <button
                                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                >
                                    Log Out
                                </button>
                            ) : (
                                <button
                                    onClick={() => loginWithRedirect()}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                >
                                    Log In
                                </button>
                            )}
                        </li>
                    </ul>






                </div>
            </div>
        </nav>
    );
}

export default Navbar;
