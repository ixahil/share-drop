📂 ShareDrop - Peer-to-Peer File & Message Sharing
==================================================

### Live Demo: 🔗 Visit ShareDrop _(Replace with actual URL)_

ShareDrop is a real-time **peer-to-peer (P2P) file and message-sharing app** built with modern web technologies. It allows users to join a session, exchange files and messages, and collaborate without a central server.

🚀 Features
-----------

*   ✅ **Instant Session Creation** - Hosts can create sessions and invite peers via QR code or session ID.
    
*   ✅ **Peer Management** - Hosts can accept or decline new peers.
    
*   ✅ **Real-time Messaging** - Chat with other peers in the session.
    
*   ✅ **Fast File Transfer** - Uses **WebRTC** for direct peer-to-peer file sharing.
    
*   ✅ **Fallback Mechanism** - If WebRTC fails, files are relayed through **Pusher Channels**.
    
*   ✅ **No Database Required** - State is managed using **Pusher Presence Channels**.
    
*   ✅ **Secure & Private** - Files are transferred directly between peers, ensuring privacy.
    

🛠️ Tech Stack
--------------

*   **Frontend**: [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
    
*   **Real-time Communication**: [Pusher](https://pusher.com/)
    
*   **P2P File Sharing**: [WebRTC](https://webrtc.org/)
    
*   **UI Components**: Tailwind CSS, React Icons
    
*   **QR Code Generation**: qrcode.react
    

🎮 How It Works
---------------

1.  The **host** creates a session.
    
2.  Peers **join via QR code or session ID**.
    
3.  The host **accepts or declines** new peers.
    
4.  Users can **send messages and files** in real-time.
    
5.  Files are transferred via **WebRTC** (or Pusher as a fallback).
    

🏗️ Installation & Setup
------------------------

### **1️⃣ Clone the Repository**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git clone https://github.com/yourusername/share-drop.git  cd share-drop   `

### **2️⃣ Install Dependencies**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   yarn install  # or npm install   `

### **3️⃣ Configure Environment Variables**

Create a .env.local file and add the required keys:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   NEXT_PUBLIC_PUSHER_APP_ID=your_pusher_app_id  NEXT_PUBLIC_PUSHER_PUBLISHABLE_KEY=your_pusher_key  PUSHER_SECRET_KEY=your_pusher_secret  NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster   `

### **4️⃣ Run the App**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   yarn dev  # or npm run dev   `

The app should now be running at **http://localhost:3000** 🚀

📸 Screenshots _(Optional)_
---------------------------

Include images of the interface (QR Code scanning, file transfer, etc.)

🤝 Contributing
---------------

We welcome contributions! Feel free to open an issue or submit a pull request.

📜 License
----------

MIT License © 2025 \[Your Name / Company\]
