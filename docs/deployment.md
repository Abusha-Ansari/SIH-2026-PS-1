# THUNDER-X — Comprehensive Deployment Guide

This guide provides step-by-step instructions for deploying the complete **THUNDER-X** full-stack platform across different hosting environments.

---

## 🚀 Option 1: Instant Cloud Deployment (Recommended for Live Demo Links)

Deploy the **Frontend on Vercel** and the **Backend on Render / Railway** (Both offer free tiers).

### **Step 1: Deploy the FastAPI Backend (Render.com)**
1. Log in to [Render.com](https://render.com) and click **New + $\to$ Web Service**.
2. Connect your GitHub repository: `https://github.com/Abusha-Ansari/SIH-2026-PS-1.git`.
3. Configure the service:
   - **Name:** `thunderx-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   ```env
   APP_NAME=THUNDER-X
   APP_ENV=production
   DEBUG=False
   PREDICTION_PROVIDER=mock
   CORS_ORIGINS=["*"]
   ```
5. Click **Create Web Service**. Once deployed, copy your backend URL (e.g., `https://thunderx-backend.onrender.com`).

---

### **Step 2: Deploy the Next.js Frontend (Vercel)**
1. Log in to [Vercel.com](https://vercel.com) and click **Add New $\to$ Project**.
2. Import your GitHub repository: `Abusha-Ansari/SIH-2026-PS-1`.
3. Configure the project:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `frontend`
4. Add Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://sih-2026-ps-1.onrender.com
   ```
   *(Note: Keep the `NEXT_PUBLIC_` prefix on Vercel so Next.js embeds the URL in the browser bundle for client-side API calls).*
5. Click **Deploy**. Vercel will build and deploy your frontend to a live URL (e.g., `https://thunder-x.vercel.app`).

---

## 🐳 Option 2: Turnkey Docker Compose Deployment (Local / VPS / AWS EC2)

Deploy the entire stack with a single command on any machine with Docker installed.

### **1. Clone and Configure**
```bash
git clone https://github.com/Abusha-Ansari/SIH-2026-PS-1.git
cd SIH-2026-PS-1
```

### **2. Launch with Docker Compose**
```bash
docker-compose up --build -d
```

### **3. Verify Services**
- **Frontend Web Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check:** [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

### **To stop the containers:**
```bash
docker-compose down
```

---

## 🖥️ Option 3: Production Linux VM Deployment (Ubuntu 22.04 / AWS / Azure / GCP)

For enterprise-grade self-hosting behind **NGINX** and **Let's Encrypt SSL**.

### **1. Install System Dependencies**
```bash
sudo apt update && sudo apt install -y python3-pip python3-venv nodejs npm git nginx certbot python3-certbot-nginx
```

### **2. Setup Backend Service (Systemd)**
```bash
cd /var/www
sudo git clone https://github.com/Abusha-Ansari/SIH-2026-PS-1.git thunderx
cd thunderx/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create Systemd Service (`/etc/systemd/system/thunderx-backend.service`):
```ini
[Unit]
Description=THUNDER-X FastAPI Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/var/www/thunderx/backend
ExecStart=/var/www/thunderx/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable thunderx-backend
sudo systemctl start thunderx-backend
```

### **3. Setup Frontend Service (PM2 / Systemd)**
```bash
cd /var/www/thunderx/frontend
npm install
npm run build
sudo npm install -g pm2
pm2 start npm --name "thunderx-frontend" -- start -- -p 3000
pm2 startup
pm2 save
```

### **4. Configure NGINX Reverse Proxy**
Edit `/etc/nginx/sites-available/thunderx`:
```nginx
server {
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API & Docs
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /docs {
        proxy_pass http://127.0.0.1:8000/docs;
    }

    location /openapi.json {
        proxy_pass http://127.0.0.1:8000/openapi.json;
    }
}
```

Activate site and obtain SSL:
```bash
sudo ln -s /etc/nginx/sites-available/thunderx /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🔒 Production Environment Variables Checklist

| Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://yourdomain.com` | Public backend URL for frontend API calls |
| `APP_ENV` | `production` | Enables production security controls |
| `DEBUG` | `False` | Disables verbose debug stack traces |
| `PREDICTION_PROVIDER` | `mock` / `ml` | Swappable prediction backend mode |
| `CORS_ORIGINS` | `["https://yourdomain.com"]` | Restricts CORS to authorized domains |
