// ========================================
// 🤖 CHATBOT EMBED SCRIPT - Script nhúng chatbot độc lập
// ========================================
// Cách sử dụng: Chỉ cần include script này vào HTML và thêm <div id="chatbot-container"></div>

;(() => {
  // ========================================
  // ⚙️ CẤU HÌNH MẶC ĐỊNH - Cấu hình chatbot
  // ========================================
  const DEFAULT_CONFIG = {
    API_KEY: "AIzaSyCZHf43t9UWpOEW6xCK8NWj4ytPiFO3pvA", // Thay thế bằng API key của bạn
    API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    BOT_NAME: "NgTienDang Chatbot", // Tên bot
    WELCOME_MESSAGE: "Xin chào 👋<br /> Tôi có thể giúp gì cho bạn hôm nay?", // Tin nhắn chào mừng
    LANGUAGE: "vi", // Ngôn ngữ mặc định: vi, en, etc.
    POSITION: "bottom-right", // Vị trí hiển thị: bottom-right, bottom-left, top-right, top-left
    THEME: "ntd", // Theme màu sắc: blue, green, purple, dark, sunset, ocean, fire, forest, galaxy, cotton
    MAX_HISTORY: 10, // Số lượng tin nhắn tối đa trong lịch sử chat
    MAX_FILE_SIZE: 5 * 1024 * 1024, // Kích thước file tối đa: 5MB
    ENABLE_FAQ: true, // Bật/tắt tính năng FAQ training
    ENABLE_IMAGE_ANALYSIS: true, // Bật/tắt tính năng phân tích ảnh
  }

  // Kết hợp với cấu hình bên ngoài nếu có
  const CONFIG = { ...DEFAULT_CONFIG, ...(window.ChatbotConfig || {}) }

  // ========================================
  // 🎯 FAQ TRAINING - Dữ liệu câu hỏi thường gặp
  // ========================================
  const FAQ_TRAINING = [
    {
      question: "Bạn là ai?",
      answer:
        "Tôi là AI assistant được train bởi Nguyễn Tiến Đăng (2005) từ Bắc Ninh. Tôi có thể giúp bạn với nhiều vấn đề khác nhau.",
    },
    {
      question: "Bạn có thể làm gì?",
      answer: "Tôi có thể trả lời câu hỏi, phân tích hình ảnh, viết code, giải thích khái niệm và nhiều việc khác.",
    },
    {
      question: "Làm thế nào để học JavaScript?",
      answer:
        "Để học JavaScript hiệu quả: 1) Học cú pháp cơ bản, 2) Thực hành DOM manipulation, 3) Học async/await, 4) Làm project thực tế.",
    },
    {
      question: "Cách giảm cân hiệu quả?",
      answer:
        "Để giảm cân hiệu quả: 1) Ăn uống lành mạnh, 2) Tập thể dục đều đặn, 3) Ngủ đủ giấc, 4) Uống nhiều nước, 5) Kiên trì và nhẫn nại.",
    },
    {
      question: "Cách học tiếng Anh?",
      answer:
        "Học tiếng Anh hiệu quả: 1) Luyện nghe hàng ngày, 2) Nói chuyện với người bản xứ, 3) Đọc sách/báo tiếng Anh, 4) Viết nhật ký, 5) Sử dụng app học tập.",
    },
  ]

  // ========================================
  // 🧠 SYSTEM PROMPT - Hướng dẫn cho AI
  // ========================================
  const SYSTEM_PROMPT = `Bạn là một AI assistant thông minh và hữu ích được train bởi Nguyễn Tiến Đăng (2005) từ Bắc Ninh. 

QUY TẮC QUAN TRỌNG:
1. LUÔN LUÔN trả lời bằng CÙNG NGÔN NGỮ với câu hỏi của user
2. Nếu user hỏi tiếng Việt → trả lời tiếng Việt
3. Nếu user hỏi tiếng Anh → trả lời tiếng Anh
4. Nếu user hỏi tiếng khác → trả lời bằng ngôn ngữ đó
5. Sử dụng ngôn ngữ tự nhiên, thân thiện và dễ hiểu
6. Trả lời chi tiết và hữu ích
7. Giữ context của cuộc trò chuyện trước đó

TÍNH NĂNG:
- Trả lời câu hỏi bằng ngôn ngữ tương ứng
- Phân tích hình ảnh và mô tả bằng ngôn ngữ tương ứng
- Viết code với comments bằng ngôn ngữ tương ứng
- Giải thích khái niệm phức tạp một cách đơn giản

Hãy bắt đầu cuộc trò chuyện!`

  // ========================================
  // 🎨 BỘ MÀU GRADIENT - Các theme màu sắc
  // ========================================
  const getGradientColors = (theme) => {
    const gradients = {
      blue: {
        primary: "#667eea",
        secondary: "#764ba2",
      },
      green: {
        primary: "#28a745",
        secondary: "#20c997",
      },
      purple: {
        primary: "#6f42c1",
        secondary: "#9c27b0",
      },
      dark: {
        primary: "#343a40",
        secondary: "#495057",
      },
      sunset: {
        primary: "#ff6b6b",
        secondary: "#feca57",
      },
      ocean: {
        primary: "#4facfe",
        secondary: "#00f2fe",
      },
      fire: {
        primary: "#fa709a",
        secondary: "#fee140",
      },
      forest: {
        primary: "#43e97b",
        secondary: "#38f9d7",
      },
      galaxy: {
        primary: "#a8edea",
        secondary: "#fed6e3",
      },
      cotton: {
        primary: "#ffecd2",
        secondary: "#fcb69f",
      },
      ntd: {
        primary: "#a492d2ff",
        secondary: "#e8f0fe",
      },
    }

    return gradients[theme] || gradients.blue
  }

  // ========================================
  // 🎨 CHÈN CSS - Tạo style cho chatbot
  // ========================================
  const injectCSS = () => {
    const colors = getGradientColors(CONFIG.THEME)

    const css = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0');

            .chatbot-embed * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: "Inter", sans-serif;
            }

            .chatbot-embed {
                position: fixed;
                z-index: 9999;
                ${CONFIG.POSITION.includes("bottom") ? "bottom: 30px;" : "top: 30px;"}
                ${CONFIG.POSITION.includes("right") ? "right: 35px;" : "left: 35px;"}
            }

            .chatbot-toggler {
                border: none;
                height: 60px;
                width: 60px;
                display: flex;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                color: #fff;
                font-size: 24px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .chatbot-toggler:hover {
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            }

            .chatbot-toggler:active {
                transform: translateY(0) scale(0.95);
            }

            .chatbot-popup {
                position: fixed;
                ${CONFIG.POSITION.includes("right") ? "right: 35px;" : "left: 35px;"}
                ${CONFIG.POSITION.includes("bottom") ? "bottom: 90px;" : "top: 90px;"}
                width: 420px;
                height: 600px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1);
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.3);
                animation: popupSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .chatbot-popup.show {
                display: flex;
            }

            @keyframes popupSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .chat-header {
                display: flex;
                align-items: center;
                padding: 20px 24px;
                background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
                color: #fff;
                justify-content: space-between;
                border-radius: 20px 20px 0 0;
                position: relative;
                overflow: hidden;
            }

            .chat-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
                animation: shimmer 3s infinite;
            }

            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            .chat-header h3 {
                font-weight: 700;
                font-size: 1.3rem;
                position: relative;
                z-index: 1;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .chat-header .close-btn {
                background: rgba(255,255,255,0.1);
                border: none;
                color: #fff;
                font-size: 20px;
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                z-index: 1;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
            }

            .header-controls {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .reset-btn {
                background: rgba(255,255,255,0.1);
                border: none;
                color: #fff;
                font-size: 16px;
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                z-index: 1;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
            }

            .reset-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.1) rotate(180deg);
            }

            .chat-header .close-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.1);
            }

            .chat-body {
                flex: 1;
                padding: 24px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            }

            .chat-body::-webkit-scrollbar {
                width: 6px;
            }

            .chat-body::-webkit-scrollbar-track {
                background: transparent;
            }

            .chat-body::-webkit-scrollbar-thumb {
                background: rgba(0,0,0,0.1);
                border-radius: 3px;
            }

            .chat-body::-webkit-scrollbar-thumb:hover {
                background: rgba(0,0,0,0.2);
            }

            .message {
                display: flex;
                gap: 12px;
                align-items: flex-start;
                animation: messageSlideIn 0.3s ease;
            }

            .message.user {
                flex-direction: row-reverse;
            }

            @keyframes messageSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .message-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 18px;
                flex-shrink: 0;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                border: 2px solid rgba(255,255,255,0.3);
            }

            .message-content {
                max-width: 75%;
                padding: 16px 20px;
                border-radius: 20px;
                font-size: 14px;
                line-height: 1.6;
                word-wrap: break-word;
                overflow-wrap: break-word;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                position: relative;
                backdrop-filter: blur(10px);
            }

            .message-content strong {
                font-weight: 600;
                color: inherit;
            }

            .message-content em {
                font-style: italic;
                color: inherit;
            }

            .message-content ul {
                margin: 8px 0;
                padding-left: 20px;
            }

            .message-content li {
                margin: 4px 0;
                line-height: 1.5;
            }

            .message-content br {
                margin: 4px 0;
            }

            .message.bot .message-content {
                background: rgba(255, 255, 255, 0.9);
                color: #2c3e50;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            .message.user .message-content {
                background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .chat-input {
                padding: 20px 24px;
                border-top: 1px solid rgba(0,0,0,0.1);
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 0 0 20px 20px;
            }

            .input-group {
                display: flex;
                gap: 12px;
                align-items: flex-end;
                position: relative;
            }

            .input-controls {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .file-btn, .file-cancel {
                background: rgba(0,0,0,0.05);
                border: none;
                cursor: pointer;
                padding: 10px;
                border-radius: 50%;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                color: #666;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0,0,0,0.1);
            }

            .file-btn:hover {
                background: rgba(0,0,0,0.1);
                color: ${colors.primary};
                transform: scale(1.05);
            }

            .file-upload-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }

            .file-preview {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
                margin-right: 5px;
            }

            .file-cancel {
                color: #ff4444;
                font-size: 14px;
                display: none;
            }

            .file-upload-wrapper.has-file .file-btn {
                display: none;
            }

            .file-upload-wrapper.has-file .file-cancel {
                display: block;
            }

            .file-upload-wrapper.has-file .file-preview {
                display: block;
            }

            .message-input {
                flex: 1;
                border: 1px solid rgba(0,0,0,0.1);
                border-radius: 25px;
                padding: 14px 20px;
                font-size: 14px;
                resize: none;
                min-height: 50px;
                max-height: 120px;
                outline: none;
                font-family: inherit;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow-y: auto;
                scrollbar-width: none;
            }
            .message-input::-webkit-scrollbar {
                display: none;
            }

            .message-input:focus {
                box-shadow: 0 0 0 3px ${colors.primary}20;
                background: rgba(255, 255, 255, 1);
            }

            .send-btn {
                background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
                color: #fff;
                border: none;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .send-btn:hover {
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            }

            .send-btn:active {
                transform: translateY(0) scale(0.95);
            }

            .send-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .thinking {
                display: flex;
                gap: 4px;
                padding: 10px;
            }

            .thinking .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #999;
                animation: thinking 1.4s infinite ease-in-out;
            }

            .thinking .dot:nth-child(1) { animation-delay: -0.32s; }
            .thinking .dot:nth-child(2) { animation-delay: -0.16s; }

            @keyframes thinking {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }

            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }

            @media (max-width: 480px) {
                .chatbot-popup {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 120px);
                    ${CONFIG.POSITION.includes("right") ? "right: 20px;" : "left: 20px;"}
                    ${CONFIG.POSITION.includes("bottom") ? "bottom: 80px;" : "top: 80px;"}
                }
                
                .message-content {
                    max-width: 85%;
                    font-size: 13px;
                    padding: 10px 14px;
                }
                
                .message-content ul {
                    padding-left: 15px;
                }
                
                .message-content li {
                    margin: 3px 0;
                }
                
                .input-controls {
                    gap: 6px;
                }
                
                .file-btn, .file-cancel {
                    padding: 8px;
                }
                
                .message-input {
                    padding: 12px 16px;                    
                }
                
                .send-btn {
                    width: 44px;
                    height: 44px;
                }               
        `

    const style = document.createElement("style")
    style.textContent = css
    document.head.appendChild(style)
  }

  // ========================================
  // 🏗️ TẠO HTML - Cấu trúc giao diện chatbot
  // ========================================
  const createHTML = () => {
    const container = document.createElement("div")
    container.className = "chatbot-embed"
    container.innerHTML = `
            <button class="chatbot-toggler" title="Chat với AI">
                💭  
            </button>
            <div class="chatbot-popup">
                <div class="chat-header">
                    <h3>${CONFIG.BOT_NAME}</h3>
                    <div class="header-controls">
                        <button class="reset-btn" title="Reset chat">🔄</button>
                        <button class="close-btn" title="Đóng">×</button>
                    </div>
                </div>
                <div class="chat-body">
                    <div class="message bot">
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">${CONFIG.WELCOME_MESSAGE}</div>
                    </div>
                </div>
                <div class="chat-input">
                    <div class="input-group">
                        <textarea class="message-input" placeholder="Nhập tin nhắn..." rows="1"></textarea>
                        <div class="input-controls">
                            <div class="file-upload-wrapper">
                                <input type="file" class="file-input" accept="image/*" hidden />
                                <img class="file-preview" src="#" hidden />
                                <button type="button" class="file-btn" title="Đính kèm file">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                                    </svg>
                                </button>
                                <button type="button" class="file-cancel" title="Hủy file">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <button class="send-btn" title="Gửi">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22,2 15,22 11,13 2,9"></polygon>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
    return container
  }

  // ========================================
  // 🤖 LỚP CHATBOT - Logic chính của chatbot
  // ========================================
  class Chatbot {
    constructor() {
      // Các phần tử DOM
      this.container = null // Container chính
      this.chatBody = null // Khu vực hiển thị tin nhắn
      this.messageInput = null // Ô nhập tin nhắn
      this.sendBtn = null // Nút gửi
      this.popup = null // Popup chat
      this.toggler = null // Nút mở/đóng

      // Các phần tử upload file
      this.fileInput = null // Input file ẩn
      this.fileBtn = null // Nút chọn file
      this.fileCancel = null // Nút hủy file
      this.filePreview = null // Xem trước file
      this.fileWrapper = null // Wrapper file

      // Các phần tử emoji picker
      this.emojiBtn = null // Nút emoji
      this.emojiPicker = null // Bảng chọn emoji

      // Trạng thái
      this.isOpen = false // Trạng thái mở/đóng
      this.isProcessing = false // Đang xử lý
      this.selectedFile = null // File đã chọn
      this.isEmojiPickerOpen = false // Emoji picker đang mở
      this.chatHistory = [] // Lịch sử chat

      this.init() // Khởi tạo chatbot
    }

    init() {
      // Chèn CSS vào trang
      injectCSS()

      // Tạo và thêm HTML vào body
      this.container = createHTML()
      document.body.appendChild(this.container)

      // Lấy các phần tử DOM
      this.chatBody = this.container.querySelector(".chat-body")
      this.messageInput = this.container.querySelector(".message-input")
      this.sendBtn = this.container.querySelector(".send-btn")
      this.popup = this.container.querySelector(".chatbot-popup")
      this.toggler = this.container.querySelector(".chatbot-toggler")

      // Lấy các phần tử upload file
      this.fileInput = this.container.querySelector(".file-input")
      this.fileBtn = this.container.querySelector(".file-btn")
      this.fileCancel = this.container.querySelector(".file-cancel")
      this.filePreview = this.container.querySelector(".file-preview")
      this.fileWrapper = this.container.querySelector(".file-upload-wrapper")

      // Gắn các sự kiện
      this.bindEvents()

      // Tự động điều chỉnh kích thước textarea
      this.autoResize()
    }

    bindEvents() {
      // Sự kiện mở/đóng chatbot
      this.toggler.addEventListener("click", () => this.toggle())

      // Sự kiện nút đóng
      this.container.querySelector(".close-btn").addEventListener("click", () => this.close())

      // Sự kiện nút gửi tin nhắn
      this.sendBtn.addEventListener("click", () => this.sendMessage())

      // Sự kiện phím Enter để gửi tin nhắn
      this.messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          this.sendMessage()
        }
      })

      // Sự kiện tự động điều chỉnh kích thước textarea
      this.messageInput.addEventListener("input", () => this.autoResize())

      // Sự kiện upload file
      this.fileBtn.addEventListener("click", () => this.fileInput.click())
      this.fileInput.addEventListener("change", (e) => this.handleFileSelect(e))
      this.fileCancel.addEventListener("click", () => this.clearFile())

      // Sự kiện reset chat
      this.container.querySelector(".reset-btn").addEventListener("click", () => this.resetChat())
    }

    // Mở/đóng chatbot
    toggle() {
      this.isOpen = !this.isOpen
      this.popup.classList.toggle("show", this.isOpen)
      if (this.isOpen) {
        this.messageInput.focus() // Tự động focus vào ô nhập tin nhắn
      }
    }

    // Đóng chatbot
    close() {
      this.isOpen = false
      this.popup.classList.remove("show")
    }

    // Tự động điều chỉnh kích thước textarea
    autoResize() {
      this.messageInput.style.height = "auto"
      this.messageInput.style.height = this.messageInput.scrollHeight + "px"
    }

    // Thêm tin nhắn vào chat
    addMessage(content, isUser = false) {
      const messageDiv = document.createElement("div")
      messageDiv.className = `message ${isUser ? "user" : "bot"}`

      const avatar = document.createElement("div")
      avatar.className = "message-avatar"
      avatar.textContent = isUser ? "👤" : "🤖"

      const messageContent = document.createElement("div")
      messageContent.className = "message-content"

      // Định dạng markdown cho tin nhắn của bot
      if (!isUser) {
        messageContent.innerHTML = this.formatMarkdown(content)
      } else {
        messageContent.innerHTML = content
      }

      messageDiv.appendChild(avatar)
      messageDiv.appendChild(messageContent)

      this.chatBody.appendChild(messageDiv)
      this.scrollToBottom() // Cuộn xuống tin nhắn mới nhất
    }

    // Định dạng markdown cho tin nhắn
    formatMarkdown(text) {
      if (!text) return ""

      return (
        text
          // Xử lý xuống dòng trước
          .split("\n")
          .map((line) => {
            // Xử lý từng dòng
            const processedLine = line
              // Chữ đậm: **text** -> <strong>text</strong>
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              // Chữ nghiêng: *text* -> <em>text</em> (nhưng không phải **text**)
              .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")

            // Xử lý danh sách
            if (line.trim().match(/^\*\s+/)) {
              const content = line.replace(/^\*\s+/, "")
              return `<li>${processedLine.replace(/^\*\s+/, "")}</li>`
            }

            return processedLine
          })
          .join("<br>")
          // Gộp các mục danh sách liên tiếp vào <ul>
          .replace(/(<li>.*?<\/li>)(<br><li>.*?<\/li>)*/g, (match) => {
            const items = match.split("<br>").filter((item) => item.includes("<li>"))
            return `<ul>${items.join("")}</ul>`
          })
          // Dọn dẹp các mục danh sách còn lại
          .replace(/<li>(.*?)<\/li>(?!\s*<ul>)/g, "<ul><li>$1</li></ul>")
          // Xóa các thẻ <ul> rỗng
          .replace(/<ul><\/ul>/g, "")
      )
    }

    // Thêm tin nhắn "đang suy nghĩ"
    addThinkingMessage() {
      const thinkingDiv = document.createElement("div")
      thinkingDiv.className = "message bot thinking-message"
      thinkingDiv.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="thinking">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>
            `
      this.chatBody.appendChild(thinkingDiv)
      this.scrollToBottom()
      return thinkingDiv
    }

    // Cuộn xuống tin nhắn mới nhất
    scrollToBottom() {
      setTimeout(() => {
        this.chatBody.scrollTop = this.chatBody.scrollHeight
      }, 100)
    }

    // ========================================
    // 🎯 TÌM KIẾM FAQ - Tìm câu trả lời phù hợp từ dữ liệu FAQ
    // ========================================
    findRelevantFAQ(userMessage) {
      if (!CONFIG.ENABLE_FAQ || !FAQ_TRAINING.length) return null

      // Tách từ khóa từ tin nhắn người dùng (chỉ lấy từ có độ dài > 2)
      const keywords = userMessage
        .toLowerCase()
        .split(" ")
        .filter((word) => word.length > 2)

      let bestMatch = null
      let bestScore = 0

      // Duyệt qua tất cả FAQ để tìm câu trả lời phù hợp nhất
      FAQ_TRAINING.forEach((faq) => {
        const questionKeywords = faq.question
          .toLowerCase()
          .split(" ")
          .filter((word) => word.length > 2)

        const answerKeywords = faq.answer
          .toLowerCase()
          .split(" ")
          .filter((word) => word.length > 2)

        let score = 0
        // Tính điểm dựa trên từ khóa trùng khớp
        keywords.forEach((keyword) => {
          if (questionKeywords.includes(keyword)) score += 3 // Điểm cao hơn nếu trùng trong câu hỏi
          if (answerKeywords.includes(keyword)) score += 1 // Điểm thấp hơn nếu trùng trong câu trả lời
        })

        if (score > bestScore) {
          bestScore = score
          bestMatch = faq
        }
      })

      return bestScore > 2 ? bestMatch : null // Chỉ trả về nếu điểm > 2
    }

    // ========================================
    // 📝 QUẢN LÝ CONTEXT - Quản lý lịch sử chat để tránh quá tải
    // ========================================
    manageContext() {
      const maxHistory = CONFIG.MAX_HISTORY

      if (this.chatHistory.length > maxHistory) {
        // Giữ lại system prompt và tin nhắn gần nhất
        let systemMessages = []
        let recentMessages = []

        // Tìm system prompt (nếu có) để giữ lại
        const systemIndex = this.chatHistory.findIndex(
          (msg) => msg.parts && msg.parts[0] && msg.parts[0].text && msg.parts[0].text.includes("QUY TẮC QUAN TRỌNG"),
        )

        if (systemIndex !== -1) {
          systemMessages = [this.chatHistory[systemIndex]]
        }

        // Lấy tin nhắn gần nhất (để lại chỗ cho system message)
        const remainingSlots = maxHistory - systemMessages.length
        recentMessages = this.chatHistory.slice(-remainingSlots)

        // Cập nhật lịch sử chat
        this.chatHistory = [...systemMessages, ...recentMessages]

        console.log(`Context managed: ${this.chatHistory.length} messages kept`)
      }
    }

    // Xử lý khi người dùng chọn file
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (!file) return

      // Kiểm tra loại file (chỉ chấp nhận ảnh)
      if (!file.type.startsWith("image/")) {
        this.showNotification("Chỉ chấp nhận file ảnh!", "error")
        return
      }

      // Kiểm tra kích thước file
      if (file.size > CONFIG.MAX_FILE_SIZE) {
        this.showNotification(`File quá lớn! Tối đa ${CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB.`, "error")
        return
      }

      this.selectedFile = file

      // Hiển thị xem trước file
      const reader = new FileReader()
      reader.onload = (e) => {
        this.filePreview.src = e.target.result
        this.filePreview.hidden = false
        this.fileWrapper.classList.add("has-file")
        this.showNotification("File đã được chọn!", "success")
      }
      reader.readAsDataURL(file)
    }

    // Xóa file đã chọn
    clearFile() {
      this.selectedFile = null
      this.fileInput.value = ""
      this.filePreview.src = "#"
      this.filePreview.hidden = true
      this.fileWrapper.classList.remove("has-file")
    }

    // ========================================
    // 🔄 QUẢN LÝ CHAT - Các chức năng quản lý cuộc trò chuyện
    // ========================================
    // Reset cuộc trò chuyện
    resetChat() {
      this.chatHistory = []
      this.chatBody.innerHTML = `
                <div class="message bot">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">${CONFIG.WELCOME_MESSAGE}</div>
                </div>
            `
      this.showNotification("Cuộc trò chuyện đã được reset!", "info")
    }

    // Lấy lịch sử chat
    getChatHistory() {
      return this.chatHistory
    }

    // Lấy thống kê chat
    getChatStats() {
      return {
        totalMessages: this.chatHistory.length, // Tổng số tin nhắn
        userMessages: this.chatHistory.filter((msg) => msg.role === "user").length, // Số tin nhắn người dùng
        botMessages: this.chatHistory.filter((msg) => msg.role === "model").length, // Số tin nhắn bot
        hasSystemPrompt: this.chatHistory.some(
          (
            msg, // Có system prompt hay không
          ) => msg.parts && msg.parts[0] && msg.parts[0].text && msg.parts[0].text.includes("QUY TẮC QUAN TRỌNG"),
        ),
      }
    }

    // ========================================
    // 🎨 QUẢN LÝ THEME - Thay đổi màu sắc giao diện
    // ========================================
    // Thay đổi theme
    changeTheme(newTheme) {
      if (!newTheme) return

      // Cập nhật cấu hình
      CONFIG.THEME = newTheme

      // Chèn lại CSS với theme mới
      this.injectThemeCSS()

      this.showNotification(`Theme đã thay đổi thành: ${getGradientColors(newTheme).name}`, "success")
    }

    // Chèn CSS cho theme
    injectThemeCSS() {
      const colors = getGradientColors(CONFIG.THEME)
      const styleId = "chatbot-theme-css"

      // Xóa CSS theme cũ nếu có
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) {
        existingStyle.remove()
      }

      // Tạo CSS theme mới
      const style = document.createElement("style")
      style.id = styleId
      style.textContent = `
                .chatbot-embed .chatbot-toggler {
                    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%) !important;
                }
                .chatbot-embed .chat-header {
                    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%) !important;
                }
                .chatbot-embed .message-avatar {
                    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%) !important;
                }
                .chatbot-embed .message.user .message-content {
                    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%) !important;
                }
                .chatbot-embed .file-btn:hover {
                    color: ${colors.primary} !important;
                }
                .chatbot-embed .message-input:focus {
                    border-color: ${colors.primary} !important;
                    box-shadow: 0 0 0 3px ${colors.primary}20 !important;
                }
                .chatbot-embed .send-btn {
                    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%) !important;
                }
            `

      document.head.appendChild(style)
    }

    // Lấy danh sách theme có sẵn
    getAvailableThemes() {
      return [
        { id: "blue", name: "Blue Purple" },
        { id: "green", name: "Green Teal" },
        { id: "purple", name: "Purple Pink" },
        { id: "dark", name: "Dark Gray" },
        { id: "sunset", name: "Sunset Orange" },
        { id: "ocean", name: "Ocean Blue" },
        { id: "fire", name: "Fire Pink" },
        { id: "forest", name: "Forest Green" },
        { id: "galaxy", name: "Galaxy Mint" },
        { id: "cotton", name: "Cotton Candy" },
      ]
    }

    // ========================================
    // 🔔 HỆ THỐNG THÔNG BÁO - Hiển thị thông báo cho người dùng
    // ========================================
    showNotification(message, type = "info") {
      const notification = document.createElement("div")
      notification.className = `chatbot-notification ${type}`
      notification.textContent = message

      // Tạo style cho thông báo
      notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-size: 14px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                max-width: 300px;
                word-wrap: break-word;
            `

      // Đặt màu nền dựa trên loại thông báo
      const colors = {
        success: "#28a745", // Thành công - màu xanh
        error: "#dc3545", // Lỗi - màu đỏ
        warning: "#ffc107", // Cảnh báo - màu vàng
        info: "#17a2b8", // Thông tin - màu xanh dương
      }
      notification.style.background = colors[type] || colors.info

      document.body.appendChild(notification)

      // Tự động xóa sau 3 giây
      setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease"
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification)
          }
        }, 300)
      }, 3000)
    }

    // ========================================
    // 📤 GỬI TIN NHẮN - Xử lý gửi tin nhắn và gọi API
    // ========================================
    async sendMessage() {
      const message = this.messageInput.value.trim()
      if (!message && !this.selectedFile) return // Không có tin nhắn và file
      if (this.isProcessing) return // Đang xử lý

      this.isProcessing = true
      this.sendBtn.disabled = true

      // Thêm tin nhắn người dùng với file nếu có
      let messageContent = message
      if (this.selectedFile) {
        messageContent += `<br><img src="${this.filePreview.src}" style="max-width: 200px; border-radius: 8px;" />`
      }

      this.addMessage(messageContent, true)
      this.messageInput.value = ""
      this.autoResize()

      // Thêm tin nhắn "đang suy nghĩ"
      const thinkingMessage = this.addThinkingMessage()

      try {
        // Kiểm tra FAQ trước
        const relevantFAQ = this.findRelevantFAQ(message)

        // Chuẩn bị request API với system prompt và lịch sử chat
        let contents = []

        // Thêm system prompt nếu đây là tin nhắn đầu tiên
        if (this.chatHistory.length === 0) {
          contents.push({
            role: "user",
            parts: [{ text: SYSTEM_PROMPT }],
          })
        }

        // Thêm lịch sử chat
        contents = contents.concat(this.chatHistory)

        // Chuẩn bị phần tin nhắn hiện tại
        const parts = []
        let enhancedMessage = message

        // Thêm context FAQ nếu tìm thấy
        if (relevantFAQ) {
          enhancedMessage = `Context từ FAQ:\nQ: ${relevantFAQ.question}\nA: ${relevantFAQ.answer}\n\nCâu hỏi của user: ${message}`
        }

        // Thêm tin nhắn text nếu có
        if (enhancedMessage.trim()) {
          parts.push({ text: enhancedMessage })
        }

        // Thêm ảnh nếu có và được bật
        if (this.selectedFile && CONFIG.ENABLE_IMAGE_ANALYSIS) {
          const base64 = await this.fileToBase64(this.selectedFile)
          parts.push({
            inline_data: {
              mime_type: this.selectedFile.type,
              data: base64,
            },
          })
        }

        // Thêm tin nhắn người dùng hiện tại
        contents.push({
          role: "user",
          parts: parts,
        })

        // Tạo payload request
        const requestBody = {
          contents: contents,
        }

        console.log("Sending request with history:", requestBody) // Log debug

        // Gọi API
        const response = await fetch(`${CONFIG.API_URL}?key=${CONFIG.API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("API Error:", errorData)
          throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`)
        }

        const data = await response.json()
        console.log("API Response:", data) // Log debug

        const botResponse = data.candidates[0].content.parts[0].text.trim()

        // Thêm vào lịch sử (lưu tin nhắn gốc cho context)
        this.chatHistory.push({
          role: "user",
          parts: [{ text: message }], // Lưu tin nhắn gốc
        })

        this.chatHistory.push({
          role: "model",
          parts: [{ text: botResponse }],
        })

        // Quản lý context
        this.manageContext()

        // Xóa tin nhắn "đang suy nghĩ" và thêm phản hồi bot
        thinkingMessage.remove()
        this.addMessage(botResponse, false)
      } catch (error) {
        console.error("Chatbot error:", error)
        thinkingMessage.remove()
        this.addMessage(`Lỗi: ${error.message}`, false)
      } finally {
        this.isProcessing = false
        this.sendBtn.disabled = false
        this.clearFile()
      }
    }

    // Chuyển đổi file thành base64
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          const base64 = reader.result.split(",")[1]
          console.log("File converted to base64, length:", base64.length) // Log debug
          resolve(base64)
        }
        reader.onerror = (error) => reject(error)
      })
    }

    // Phương thức test để debug phân tích ảnh
    async testImageAnalysis() {
      console.log("Testing image analysis...")
      const testImage =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      const base64 = testImage.split(",")[1]

      const requestBody = {
        contents: [
          {
            role: "user",
            parts: [
              { text: "Hãy mô tả ảnh này" },
              {
                inline_data: {
                  mime_type: "image/png",
                  data: base64,
                },
              },
            ],
          },
        ],
      }

      try {
        const response = await fetch(`${CONFIG.API_URL}?key=${CONFIG.API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Test API Error:", errorData)
          return false
        }

        const data = await response.json()
        console.log("Test API Response:", data)
        return true
      } catch (error) {
        console.error("Test failed:", error)
        return false
      }
    }
  }

  // ========================================
  // 🚀 KHỞI TẠO CHATBOT - Tạo instance khi DOM sẵn sàng
  // ========================================
  let chatbotInstance
  if (document.readyState === "loading") {
    // DOM chưa sẵn sàng, đợi sự kiện DOMContentLoaded
    document.addEventListener("DOMContentLoaded", () => {
      chatbotInstance = new Chatbot()
      window.chatbotInstance = chatbotInstance // Để có thể truy cập từ bên ngoài
    })
  } else {
    // DOM đã sẵn sàng, tạo ngay lập tức
    chatbotInstance = new Chatbot()
    window.chatbotInstance = chatbotInstance // Để có thể truy cập từ bên ngoài
  }
})()
