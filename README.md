#  YASCON Official Website

Official website for **Youth Association for Conservation of Nature and Environment (YASCON)** — Malawi.

This platform serves as the digital presence for YASCON’s national and regional activities, environmental programs, press releases, and youth-led conservation initiatives.

---

## About YASCON

**Youth Association for Conservation of Nature and Environment (YASCON)** is a youth-led environmental organization committed to:

*  Tree planting and reforestation
*  Climate change mitigation awareness
*  Environmental conservation
*  Youth engagement in sustainable development

---

#  Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Deployment:** Vercel (recommended)

---`

Design principles:

* Clean
* Professional NGO layout
* Youth-focused
* Environmental theme

---

#  Getting Started

##  Install Dependencies


npm install


---

##  Run Development Server

npm run dev


Open:

http://localhost:3000


## Build for Production


npm run build
npm start


---

#  Team Workflow (Important)

This project uses a structured Git workflow:

* `main` → Production branch
* `staging` → Integration branch
* `regions` → Feature branches for specific regions

### Rules

* No direct push to `main`
* Pull Requests required
* Code review required before merge
* Make sure you only push your code into your region

---

#  Contribution Guidelines

1. Pull latest `staging`

 
   git checkout staging
   git pull origin staging
 

2. Create region branch

 
   git checkout -b your-region-name
  

3. Commit changes

4. Push branch

5. Open Pull Request → `staging`

---

#  License

This project is developed for the official use of YASCON.
All branding and organizational content belong to Youth Association for Conservation of Nature and Environment.

---

# CMS Dashboard Setup

The CMS dashboard is available at:

`/dashboard/cms`

It uses PostgreSQL + API routes for authentication, content management, and user management.

Required environment variables:

```env
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DB_NAME
CMS_SUPERADMIN_EMAIL=admin@example.com
CMS_SUPERADMIN_PASSWORD=change-me
CMS_SUPERADMIN_NAME=CMS Super Admin
```

How it works:

1. On first authenticated API call, CMS tables are auto-created.
2. If `CMS_SUPERADMIN_EMAIL` and `CMS_SUPERADMIN_PASSWORD` are set, a bootstrap super admin is created (if not already present).
3. Login via `/dashboard/login`, then access `/dashboard/cms`.

Authorization rules:

1. `super_admin`: can access all regions + national content, and manage all users.
2. `regional_admin`: can only access and manage content in their own region.
