website link : https://ai-pdf-note-taker-puce.vercel.app/
---

## 📚 AI PDF Note-Taker – Full Stack SaaS Application

**AI PDF Note-Taker** is a powerful full-stack SaaS application that enables users to upload PDF files, ask questions based on the content, and receive AI-generated answers that can be saved as editable notes. Built with cutting-edge web and AI technologies, this project enhances productivity for students, researchers, content creators, and professionals who need to summarize or query documents quickly without reading them manually.

---

## 🧠 Key Features

* ✅ Upload and manage PDF documents
* 🧾 Ask questions about uploaded PDFs and get contextual AI answers
* 📝 Use a rich text editor (Tiptap) to format and save notes
* 🔐 Secure authentication using Clerk
* 🧠 Google Gemini + LangChain-powered AI pipeline for accurate answers
* 🔎 Text embedding and vector search using Convex
* 💳 PayPal integration for credit-based PDF upload (SaaS model)
* ☁️ Deployed seamlessly with Vercel
* 🎨 Styled with Tailwind CSS and component libraries like ShadCN, Lucide, HyperUI

---

## 🚀 Technology Stack

| Category            | Technology                                           |
| ------------------- | ---------------------------------------------------- |
| Frontend Framework  | React + Next.js                                      |
| Styling & UI        | Tailwind CSS, Shadcn/UI, Lucide, Flaticon, HyperUI   |
| Text Editing        | Tiptap                                               |
| Authentication      | Clerk                                                |
| AI Model            | Google Gemini 2.0 Flash                              |
| AI Orchestration    | LangChain                                            |
| Backend & Database  | Convex (supports real-time data + vector embeddings) |
| Payment Integration | React PayPal JS + PayPal Developer Sandbox           |
| Deployment          | Vercel                                               |

---

## 📈 Real-World Use Cases

* **Students:** Generate concise notes from textbooks or lecture PDFs
* **Researchers:** Query specific topics across lengthy research papers
* **Educators:** Summarize materials and create quick reference guides
* **Content Writers:** Extract relevant material and repurpose it into blogs
* **Legal/Corporate:** Ask AI to find clauses or key summaries from large documents

---

## 🧩 Project Flow

1. **PDF Upload:** File uploaded to Convex Storage → URL generated.
2. **PDF Parsing:** LangChain splits file into chunks and extracts metadata with file ID.
3. **Embedding:** Gemini converts text to vectors → stored in Convex as vector store.
4. **AI Questioning:** User types a query → LangChain fetches context → Gemini generates answer.
5. **Note Editing:** Answer is loaded into Tiptap rich editor → user can format and save.
6. **Note Storage:** Notes saved in Convex mapped by file ID + user email.
7. **Access Control:** Only 5 uploads for free users → upgrade with PayPal to unlock full access.

---

## 🛠️ Challenges Faced & Solutions

### 1. **Storing and Accessing PDFs**

* **Challenge:** How to store large PDF files and ensure quick access?
* **Solution:** Used Convex Storage which supports uploading and URL-based access. After upload, we store the URL and use it for PDF rendering in the frontend.

### 2. **Converting Text to Embeddings**

* **Challenge:** Selecting the right LLM and embedding model to balance speed and quality.
* **Solution:** Integrated Google Gemini 2.0 Flash with LangChain for faster response and reliable contextual embedding.

### 3. **Vector Search Specificity**

* **Challenge:** Ensuring AI does not fetch data from PDFs uploaded by other users.
* **Solution:** Embedded `fileId` as metadata in vector storage and filtered vector search results to match only relevant `fileId`.

### 4. **Authentication Decision**

* **Challenge:** Choosing the right auth system for scalability and simplicity.
* **Solution:** Selected Clerk for its seamless Next.js integration, social login options, and built-in UI components.

### 5. **SaaS Integration via PayPal**

* **Challenge:** Making the project monetizable via credit-based limits.
* **Solution:** Integrated PayPal with `react-paypal-js`, created sandbox test accounts, and updated user records post-payment to allow unlimited PDF uploads.

---

## ⚙️ Performance Optimization

* **AI Pipeline Optimization:** Used Gemini Flash model (lightweight) for faster inference.
* **Vector Search Efficiency:** Chunking optimized with LangChain’s token-size-aware splitter.
* **Conditional Rendering:** Only load editor or AI response components when needed.
* **API Caching:** Cached AI results to prevent redundant generation for the same query.
* **Database Optimization:** Indexed convex tables and filtered vector queries by metadata.

---

## 🌐 Deployment Steps

1. Push code to GitHub
2. Create Vercel Project → import GitHub repo
3. Deploy Convex backend → get production keys
4. Add all `.env` variables in Vercel dashboard
5. Connect domain (optional) and deploy

---
💬 Feedback or Contributions?
If you find this useful or want to contribute, feel free to raise an issue or pull request.
You can also connect with me on LinkedIn or Twitter!
