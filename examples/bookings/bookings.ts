import type {} from "@angular-wave/angular.ts";
import {
  Bell,
  CalendarDays,
  CircleUserRound,
  Clock3,
  createElement,
  FileText,
  Headphones,
  House,
  type IconNode,
  Luggage,
  Menu,
  PanelLeftClose,
  Plane,
  Plus,
  Rocket,
  Search,
  Settings,
  Ticket,
  Users,
} from "lucide";

type BookingStatus = "Confirmed" | "Pending" | "Change Requested";

interface Booking {
  reference: string;
  service: string;
  vessel: string;
  status: BookingStatus;
  origin: string;
  departure: string;
  duration: string;
  destination: string;
  arrival: string;
  customer: string;
  customerId: string;
  cabin: string;
  luggage: string;
  allowance: string;
  visible: boolean;
}

const bookings: Omit<Booking, "visible">[] = [
  {
    reference: "IRST-289163384",
    service: "ISV-2789",
    vessel: "Galactic Pioneer",
    status: "Confirmed",
    origin: "Earth",
    departure: "Fri, Nov 15, 2024",
    duration: "147 Earth days",
    destination: "Kepler-22b",
    arrival: "Fri, Apr 11, 2025",
    customer: "Nora Hansen",
    customerId: "231396647-IRST",
    cabin: "Utility Deck, Luxury Suite 6B",
    luggage: "3 items, up to 3kg each",
    allowance: "25kg total",
  },
  {
    reference: "IRST-969282898",
    service: "ISV-2300",
    vessel: "Celestial Harmony",
    status: "Confirmed",
    origin: "Venus",
    departure: "Thu, Jul 25, 2024",
    duration: "274 Earth days",
    destination: "Celestara Minor",
    arrival: "Fri, Apr 25, 2025",
    customer: "Aarav Singh",
    customerId: "314823984-IRST",
    cabin: "Habitation Deck, Luxury Suite 7A",
    luggage: "1 item, up to 10kg",
    allowance: "15kg total",
  },
  {
    reference: "IRST-827564967",
    service: "ISV-2724",
    vessel: "Galactic Pioneer",
    status: "Confirmed",
    origin: "Helioshade Realm",
    departure: "Mon, Oct 28, 2024",
    duration: "213 Earth days",
    destination: "Zephyria Prime",
    arrival: "Thu, May 29, 2025",
    customer: "Amirah Rahman",
    customerId: "579920614-IRST",
    cabin: "Observation Deck, Deluxe Pod 2C",
    luggage: "1 item, up to 10kg",
    allowance: "25kg total",
  },
  {
    reference: "IRST-274554354",
    service: "ISV-2517",
    vessel: "Quantum Quest",
    status: "Confirmed",
    origin: "Arcadium Zenith",
    departure: "Sun, Aug 4, 2024",
    duration: "467 Earth days",
    destination: "Mars",
    arrival: "Fri, Nov 14, 2025",
    customer: "Mia Wong",
    customerId: "553370169-IRST",
    cabin: "Observation Deck, Deluxe Pod 6A",
    luggage: "2 items, up to 5kg each",
    allowance: "20kg total",
  },
  {
    reference: "IRST-802072508",
    service: "ISV-3005",
    vessel: "Galactic Pioneer",
    status: "Pending",
    origin: "Mars",
    departure: "Sun, Sep 1, 2024",
    duration: "269 Earth days",
    destination: "Arcadium Zenith",
    arrival: "Wed, May 28, 2025",
    customer: "Olivia Kim",
    customerId: "452854844-IRST",
    cabin: "Habitation Deck, Standard Pod 2A",
    luggage: "1 item, up to 10kg",
    allowance: "15kg total",
  },
  {
    reference: "IRST-653002008",
    service: "ISV-2307",
    vessel: "Nebula Navigator",
    status: "Change Requested",
    origin: "Saturn",
    departure: "Mon, Oct 21, 2024",
    duration: "228 Earth days",
    destination: "Aquarion Delta",
    arrival: "Fri, Jun 6, 2025",
    customer: "Noah Smith",
    customerId: "586303598-IRST",
    cabin: "Utility Deck, Deluxe Pod 6C",
    luggage: "2 items, up to 5kg each",
    allowance: "15kg total",
  },
  {
    reference: "IRST-523523471",
    service: "ISV-2698",
    vessel: "Voyager Zenith",
    status: "Pending",
    origin: "Neptune",
    departure: "Thu, Sep 12, 2024",
    duration: "278 Earth days",
    destination: "Thalassa's Cove",
    arrival: "Tue, Jun 17, 2025",
    customer: "Hannah Muller",
    customerId: "739937522-IRST",
    cabin: "Utility Deck, Deluxe Pod 3D",
    luggage: "3 items, up to 3kg each",
    allowance: "25kg total",
  },
  {
    reference: "IRST-944683597",
    service: "ISV-2998",
    vessel: "Starlight Sovereign",
    status: "Confirmed",
    origin: "Jupiter",
    departure: "Wed, Mar 13, 2024",
    duration: "212 Earth days",
    destination: "Meridianus Lux",
    arrival: "Fri, Oct 11, 2024",
    customer: "Mateo Gonzalez",
    customerId: "897332940-IRST",
    cabin: "Observation Deck, Standard Pod 6C",
    luggage: "3 items, up to 3kg each",
    allowance: "15kg total",
  },
];

const iconNodes: Record<string, IconNode> = {
  bell: Bell,
  bookings: CalendarDays,
  clock: Clock3,
  customer: CircleUserRound,
  customers: Users,
  invoices: FileText,
  luggage: Luggage,
  menu: Menu,
  panel: PanelLeftClose,
  plane: Plane,
  plus: Plus,
  rocket: Rocket,
  search: Search,
  settings: Settings,
  support: Headphones,
  ticket: Ticket,
  home: House,
};

class BookingsController {
  query = "";
  status = "All";
  readonly bookings = bookings.map((booking) => ({
    ...booking,
    visible: true,
  }));
  selected = this.bookings[0];
  visibleCount = this.bookings.length;
  empty = false;

  constructor() {
    const mobile = window.matchMedia("(max-width: 760px)");
    const syncSidebar = () => {
      const sidebar = document.querySelector<HTMLElement>("#booking-sidebar");
      sidebar?.toggleAttribute("collapsed", mobile.matches);
    };
    requestAnimationFrame(syncSidebar);
    mobile.addEventListener("change", syncSidebar);
  }

  updateVisible(): void {
    const query = this.query.trim().toLocaleLowerCase();
    this.bookings.forEach((booking) => {
      const matchesStatus =
        this.status === "All" || booking.status === this.status;
      const matchesQuery =
        !query ||
        Object.values(booking).some(
          (value) =>
            typeof value === "string" &&
            value.toLocaleLowerCase().includes(query),
        );
      booking.visible = matchesStatus && matchesQuery;
    });
    this.visibleCount = this.bookings.filter(
      (booking) => booking.visible,
    ).length;
    this.empty = this.visibleCount === 0;
  }

  select(booking: Booking): void {
    this.selected = booking;
  }

  setStatus(status: string): void {
    this.status = status;
    this.updateVisible();
  }
}

window.angular
  .createModule("bookingsDemo", ["angular.css"])
  .directive("ngIcon", () => ({
    link(_scope: ng.Scope, element: HTMLElement) {
      const name = element.getAttribute("ng-icon") || "";
      const icon = iconNodes[name];
      if (!icon) return;
      element.replaceChildren(
        createElement(icon, {
          "aria-hidden": "true",
          focusable: "false",
          height: 18,
          width: 18,
        }),
      );
    },
  }))
  .controller("BookingsController", BookingsController);
