(function () {
  'use strict';

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  };

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */


  const createSVGElement = ([tag, attrs, children]) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs).forEach((name) => {
      element.setAttribute(name, String(attrs[name]));
    });
    if (children?.length) {
      children.forEach((child) => {
        const childElement = createSVGElement(child);
        element.appendChild(childElement);
      });
    }
    return element;
  };
  const createElement = (iconNode, customAttrs = {}) => {
    const tag = "svg";
    const attrs = {
      ...defaultAttributes,
      ...customAttrs
    };
    return createSVGElement([tag, attrs, iconNode]);
  };

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const Bell = [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
    [
      "path",
      {
        d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
      }
    ]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const CalendarDays = [
    ["path", { d: "M8 2v3" }],
    ["path", { d: "M16 2v3" }],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
    ["path", { d: "M3 9h18" }],
    ["path", { d: "M8 13h.01" }],
    ["path", { d: "M12 13h.01" }],
    ["path", { d: "M16 13h.01" }],
    ["path", { d: "M8 17h.01" }],
    ["path", { d: "M12 17h.01" }],
    ["path", { d: "M16 17h.01" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const CircleUserRound = [
    ["path", { d: "M17.925 20.056a6 6 0 0 0-11.851.001" }],
    ["circle", { cx: "12", cy: "11", r: "4" }],
    ["circle", { cx: "12", cy: "12", r: "10" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const Clock3 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 6v6h4" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const FileText = [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
      }
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5" }],
    ["path", { d: "M10 9H8" }],
    ["path", { d: "M16 13H8" }],
    ["path", { d: "M16 17H8" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const Headphones = [
    [
      "path",
      {
        d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"
      }
    ]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const House = [
    ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }],
    [
      "path",
      {
        d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      }
    ]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const Luggage = [
    ["path", { d: "M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2" }],
    ["path", { d: "M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14" }],
    ["path", { d: "M10 20h4" }],
    ["circle", { cx: "16", cy: "20", r: "2" }],
    ["circle", { cx: "8", cy: "20", r: "2" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const Menu = [
    ["path", { d: "M4 5h16" }],
    ["path", { d: "M4 12h16" }],
    ["path", { d: "M4 19h16" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const PanelLeftClose = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 3v18" }],
    ["path", { d: "m16 15-3-3 3-3" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const Plane = [
    [
      "path",
      {
        d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
      }
    ]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const Plus = [
    ["path", { d: "M5 12h14" }],
    ["path", { d: "M12 5v14" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const Rocket = [
    ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" }],
    [
      "path",
      {
        d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"
      }
    ],
    [
      "path",
      {
        d: "M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"
      }
    ],
    ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const Search = [
    ["path", { d: "m21 21-4.34-4.34" }],
    ["circle", { cx: "11", cy: "11", r: "8" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const Settings = [
    [
      "path",
      {
        d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const Ticket = [
    [
      "path",
      {
        d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
      }
    ],
    ["path", { d: "M13 5v2" }],
    ["path", { d: "M13 17v2" }],
    ["path", { d: "M13 11v2" }]
  ];

  /**
   * @license lucide v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */

  const Users = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
    ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }],
    ["circle", { cx: "9", cy: "7", r: "4" }]
  ];

  const bookings = [
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
  const iconNodes = {
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
      bookings = bookings.map((booking) => ({
          ...booking,
          visible: true,
      }));
      selected = this.bookings[0];
      visibleCount = this.bookings.length;
      empty = false;
      constructor() {
          const mobile = window.matchMedia("(max-width: 760px)");
          const syncSidebar = () => {
              const sidebar = document.querySelector("#booking-sidebar");
              sidebar?.toggleAttribute("collapsed", mobile.matches);
          };
          requestAnimationFrame(syncSidebar);
          mobile.addEventListener("change", syncSidebar);
      }
      updateVisible() {
          const query = this.query.trim().toLocaleLowerCase();
          this.bookings.forEach((booking) => {
              const matchesStatus = this.status === "All" || booking.status === this.status;
              const matchesQuery = !query ||
                  Object.values(booking).some((value) => typeof value === "string" &&
                      value.toLocaleLowerCase().includes(query));
              booking.visible = matchesStatus && matchesQuery;
          });
          this.visibleCount = this.bookings.filter((booking) => booking.visible).length;
          this.empty = this.visibleCount === 0;
      }
      select(booking) {
          this.selected = booking;
      }
      setStatus(status) {
          this.status = status;
          this.updateVisible();
      }
  }
  window.angular
      .createModule("bookingsDemo", ["angular.css"])
      .directive("ngIcon", () => ({
      link(_scope, element) {
          const name = element.getAttribute("ng-icon") || "";
          const icon = iconNodes[name];
          if (!icon)
              return;
          element.replaceChildren(createElement(icon, {
              "aria-hidden": "true",
              focusable: "false",
              height: 18,
              width: 18,
          }));
      },
  }))
      .controller("BookingsController", BookingsController);

})();
