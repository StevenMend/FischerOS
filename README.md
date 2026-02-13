# FischerOS

FischerOS is a hospitality operations platform built as a Progressive Web App (PWA).  
It functions as a real-time operational layer connecting guests, hotel staff, and management into a single unified system.

This is not a digital menu or a basic hotel app — it is an internal operating system designed to manage guest requests, staff workflows, services, and property operations from one centralized interface.

---

## What It Does

FischerOS replaces fragmented communication tools like WhatsApp chains, paper notes, and disconnected systems with structured, trackable workflows.

Guests interact through a QR-based interface with zero downloads required.  
Staff operate through department-specific dashboards.  
Management gains real-time operational visibility and analytics.

All interactions flow through a structured request and task system with full tracking and lifecycle management.

---

## Guest Experience

Guests access the platform by scanning a QR code from their room or anywhere on the property.

From their interface they can:

- Browse restaurants and digital menus
- Reserve tables
- Book spa treatments
- Schedule tours and activities
- Request housekeeping or amenities
- Report maintenance issues
- Chat with an AI concierge
- View property maps and services
- Check weather and local conditions
- Discover partner businesses and experiences

Each action becomes a structured request routed automatically to the correct department.

---

## Staff Operations

Each department operates from a focused dashboard designed around real workflows:

- Housekeeping manages cleaning tasks
- Maintenance handles issue reports
- Concierge organizes tours and transportation
- Restaurants manage reservations and service flow
- Spa staff manage appointments and schedules
- Front desk oversees guest requests and coordination

---

No manual forwarding, no lost messages, and full accountability per task.

---

## Admin & Management Layer

Management has access to an executive console providing:

- Operational KPIs
- Department workload visibility
- Request analytics
- Staff management
- Partner management
- Feature configuration
- Property branding and white-label settings

This layer transforms daily operations into measurable, optimizable processes.

---

## Problem It Solves

Mid-size hotels often run operations through informal communication:

- Requests arrive through messaging apps
- Front desk manually forwards tasks
- Departments lose track of responsibilities
- No historical data or analytics exist
- Managers lack visibility into operational bottlenecks

FischerOS converts all interactions into structured, trackable workflows with real-time status and reporting.

---

## Technical Stack

- React 18 + TypeScript
- Vite
- Supabase (Auth, Database, Realtime)
- TanStack React Query v5
- Zustand state management
- React Router v7
- Tailwind CSS
- Service Worker (offline support)
- Push Notifications

---

## Architecture

Feature-based modular structure with ports & adapters.

Each domain module contains:

- api
- components
- hooks
- pages
- types

Modules include:

- Restaurants
- Tours & Activities
- Spa Management
- Service Requests
- Staff Operations
- Admin Dashboard

The platform supports:

- Mock data mode for demos
- Live Supabase integration for production
- Multi-tenant white-label configuration

---

## White-Label SaaS Design

FischerOS is designed as a reusable multi-property platform.

Each hotel can have:

- Custom branding
- Feature toggles
- Department configuration
- Independent operational data
- Dedicated routing via property slug

One codebase, multiple properties.

---

## Vision

FischerOS aims to become a vertical SaaS platform for hospitality operations — replacing fragmented internal tools with a unified, real-time operational system focused on speed, visibility, and automation.