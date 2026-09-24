/* ============================================================================
   COSTAR NETWORK — UPCOMING EVENTS
   ----------------------------------------------------------------------------
   This is the only file you should need to edit day-to-day.

   HOW TO ADD AN EVENT
   Copy one of the blocks below (between the { and }), paste it above the
   closing bracket "];" at the bottom, and fill in your own details.

   FIELDS
     title      - required. Shown on the calendar and in the day pop-up.
     date       - required for a single-day event. Format: "YYYY-MM-DD"
     startDate  - use instead of "date" for an event that spans several days
     endDate    - the last day of a multi-day event (inclusive)
     type       - required. Controls the colour of the pill. Use one of:
                  "Webinar", "Workshop", "Event", "Funding & Support", "News"
                  (You can add new types — see CATEGORY_COLOURS in index.html)
     lab        - optional. e.g. "Realtime Lab", "Live Lab". Shown in the
                  day pop-up under the title. Leave as "" if not relevant.
     url        - required. Where clicking the event should take people.

   Dates use the LOCAL calendar day, so just write the date as it appears
   on the CoSTAR website — no timezone conversion needed.
   ============================================================================ */

const CALENDAR_EVENTS = [

  {
    title: "Webinar: Experience on the Ethical Use of AI in the Creative Industry",
    date: "2026-09-29",
    type: "Webinar",
    lab: "Realtime Lab",
    url: "https://www.costarnetwork.co.uk/latest/Ethical-Use-of-AI-in-the-creative-industry"
  },

  {
    title: "CoSTAR Live Lab Presents: Shammi Raj Balla",
    date: "2026-09-29",
    type: "Event",
    lab: "Live Lab",
    url: "https://www.costarnetwork.co.uk/latest/costar-live-lab-presents-shammi-raj-balla"
  },
    {
    title: "CoSTAR Live Lab Presents: Shammi Raj Balla",
    date: "2026-09-29",
    type: "Event",
    lab: "Live Lab",
    url: "https://www.costarnetwork.co.uk/latest/costar-live-lab-presents-shammi-raj-balla"
  },
    {
    title: "CoSTAR Live Lab Presents: Shammi Raj Balla",
    date: "2026-09-29",
    type: "Event",
    lab: "Live Lab",
    url: "https://www.costarnetwork.co.uk/latest/costar-live-lab-presents-shammi-raj-balla"
  },
    {
    title: "CoSTAR Live Lab Presents: Shammi Raj Balla",
    date: "2026-09-29",
    type: "Event",
    lab: "Live Lab",
    url: "https://www.costarnetwork.co.uk/latest/costar-live-lab-presents-shammi-raj-balla"
  },

  /* ---- Example placeholders — replace or delete these two ---- */

  {
    title: "Example: multi-day workshop (spans 3 days)",
    startDate: "2026-10-12",
    endDate: "2026-10-14",
    type: "Workshop",
    lab: "National Lab",
    url: "https://www.costarnetwork.co.uk/latest"
  },

  {
    title: "Example: funding call deadline",
    date: "2026-10-20",
    type: "Funding & Support",
    lab: "",
    url: "https://www.costarnetwork.co.uk/funding-and-support"
  }

];
