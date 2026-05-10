import type { SavedTree } from "./types";

export const DIESEL_SEED: SavedTree = {
  id: "seed-diesel-1",
  domain: "diesel",
  title: "Cummins X15 No-Crank Diagnosis",
  rootText:
    "First thing I do when a Cummins X15 won't crank is check battery voltage at the terminals...",
  createdAt: "2024-01-15T08:00:00Z",
  root: {
    id: "d1",
    type: "question",
    text: "Does the truck make any sound at all when you turn the key to start?",
    children: [
      {
        label: "Complete silence",
        node: {
          id: "d2",
          type: "check",
          text: "Check battery voltage at the terminals with a multimeter. What does it read?",
          children: [
            {
              label: "Under 12.4V",
              node: {
                id: "d3",
                type: "conclusion",
                text: "Likely cause: Dead or weak battery. Charge or replace the battery. Check alternator output (should be 13.8–14.4V at idle) to rule out a charging fault before returning the truck to service.",
                children: [],
              },
            },
            {
              label: "12.4V or above",
              node: {
                id: "d4",
                type: "check",
                text: "Inspect the ground strap from the engine block to the frame rail. Is it tight, clean, and free of corrosion?",
                children: [
                  {
                    label: "Corroded or loose",
                    node: {
                      id: "d5",
                      type: "conclusion",
                      text: "Likely cause: Bad ground strap. Clean the connection points with a wire brush, apply dielectric grease, and retorque. This is the most common cause of silent no-starts with good battery voltage.",
                      children: [],
                    },
                  },
                  {
                    label: "Ground looks good",
                    node: {
                      id: "d6",
                      type: "check",
                      text: "Have someone hold the key in the start position. Do you hear a single click from the starter solenoid?",
                      children: [
                        {
                          label: "Single click, no crank",
                          node: {
                            id: "d7",
                            type: "conclusion",
                            text: "Likely cause: Failed starter motor. The solenoid is engaging but the motor isn't turning. Replace the starter. Verify the replacement by load-testing the battery first — a starter failure can mask a weak battery.",
                            children: [],
                          },
                        },
                        {
                          label: "No click at all",
                          node: {
                            id: "d8",
                            type: "check",
                            text: "Check for active fault codes on the dash or with a diagnostic tool. Is there a park brake interlock or clutch inhibit fault active?",
                            children: [
                              {
                                label: "Interlock fault active",
                                node: {
                                  id: "d9",
                                  type: "conclusion",
                                  text: "Likely cause: Inhibit switch preventing starter engagement. Verify the park brake is fully set. Check the clutch pedal switch (manual) or neutral safety switch (automatic). Clear the fault and retest.",
                                  children: [],
                                },
                              },
                              {
                                label: "No relevant faults",
                                node: {
                                  id: "d10",
                                  type: "conclusion",
                                  text: "Likely cause: Faulty starter relay or open circuit between ignition switch and solenoid. Test voltage at the solenoid control terminal during a start attempt. If no voltage, trace back to the relay and ignition switch.",
                                  children: [],
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        label: "Clicks rapidly",
        node: {
          id: "d11",
          type: "conclusion",
          text: "Likely cause: Low battery voltage under load. Battery voltage may read acceptable at rest but drop below 9V during cranking. Load-test the battery. Also check for high resistance in the positive cable — measure voltage drop across it during a start attempt (should be under 0.5V).",
          children: [],
        },
      },
      {
        label: "Cranks slowly, won't start",
        node: {
          id: "d12",
          type: "check",
          text: "Has the truck been sitting overnight in cold temperatures (below 20°F)?",
          children: [
            {
              label: "Yes, cold soak",
              node: {
                id: "d13",
                type: "conclusion",
                text: "Likely cause: Cold-related starting difficulty — gelled fuel or insufficient glow plug/intake heater warm-up. Check that the wait-to-start light cycled fully before cranking. Test intake air heater operation. Check fuel filter for water or gel.",
                children: [],
              },
            },
            {
              label: "No, normal temps",
              node: {
                id: "d14",
                type: "check",
                text: "Connect diagnostic tool. Is fuel rail pressure reaching at least 5,000 psi during cranking?",
                children: [
                  {
                    label: "Below 5,000 psi",
                    node: {
                      id: "d15",
                      type: "conclusion",
                      text: "Likely cause: Fuel system fault — air in fuel, failed lift pump, or plugged fuel filter. Prime the system, check for air leaks at filter housing and supply lines, and measure lift pump pressure (should be 10–15 psi). Replace filter if more than 100k miles since last change.",
                      children: [],
                    },
                  },
                  {
                    label: "Pressure looks good",
                    node: {
                      id: "d16",
                      type: "conclusion",
                      text: "Likely cause: Compression issue or injector fault. Pull fault codes — look for camshaft or crankshaft position sensor codes. Perform a cylinder cutout test to identify misfiring cylinders. This will require a deeper diagnostic workup.",
                      children: [],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
};

export const INSPECTION_SEED: SavedTree = {
  id: "seed-inspection-1",
  domain: "inspection",
  title: "Commercial Lighting Fixture Defect",
  rootText:
    "When I get a report of a lighting fixture defect the first thing I check is whether it's one fixture or multiple...",
  createdAt: "2024-01-15T09:00:00Z",
  root: {
    id: "i1",
    type: "question",
    text: "Is the reported defect affecting a single fixture or multiple fixtures on the same circuit?",
    children: [
      {
        label: "Multiple fixtures",
        node: {
          id: "i2",
          type: "check",
          text: "Check the upstream circuit breaker and wiring. Is the breaker tripped or is supply voltage below 95% of rated?",
          children: [
            {
              label: "Breaker tripped or low voltage",
              node: {
                id: "i3",
                type: "conclusion",
                text: "Likely cause: Upstream supply fault. Reset the breaker and monitor for recurrence. If it trips again, measure current draw — you likely have an overloaded circuit or a short in the wiring run. Involve a licensed electrician for any wiring fault.",
                children: [],
              },
            },
            {
              label: "Supply voltage normal",
              node: {
                id: "i4",
                type: "conclusion",
                text: "Likely cause: Coordinated driver failure across a batch — common if all fixtures were from the same production lot. Pull the driver model and lot number from each fixture. Check the manufacturer's service bulletin list. Replace drivers as a batch.",
                children: [],
              },
            },
          ],
        },
      },
      {
        label: "Single fixture",
        node: {
          id: "i5",
          type: "question",
          text: "What is the failure mode? Is the fixture completely dark, flickering, or producing abnormal light quality (wrong color, dim)?",
          children: [
            {
              label: "Completely dark",
              node: {
                id: "i6",
                type: "check",
                text: "Does the driver have a status LED? If yes, what color/pattern is it showing?",
                children: [
                  {
                    label: "Solid red",
                    node: {
                      id: "i7",
                      type: "check",
                      text: "Touch the driver housing with the back of your hand for 3 seconds. Is it too hot to hold?",
                      children: [
                        {
                          label: "Extremely hot",
                          node: {
                            id: "i8",
                            type: "conclusion",
                            text: "Likely cause: Thermal shutdown due to inadequate heat dissipation. Check that the fixture's mounting surface is conducting heat — painted surfaces or insulated ceilings block heat transfer. Check for debris blocking heatsink fins. The driver may have sustained damage; replace it and verify mounting.",
                            children: [],
                          },
                        },
                        {
                          label: "Normal temperature",
                          node: {
                            id: "i9",
                            type: "conclusion",
                            text: "Likely cause: Driver internal fault (solid red, normal temp). The driver has shut down due to an internal protection trigger — often an output short or LED array failure. Disconnect the LED array and test driver output. If output recovers, the LED array is shorted; replace the array or the full luminaire.",
                            children: [],
                          },
                        },
                      ],
                    },
                  },
                  {
                    label: "No LED / no indicator",
                    node: {
                      id: "i10",
                      type: "check",
                      text: "Measure input voltage at the driver terminals. Is line voltage present (within 10% of rated)?",
                      children: [
                        {
                          label: "No input voltage",
                          node: {
                            id: "i11",
                            type: "conclusion",
                            text: "Likely cause: No supply to the fixture — open circuit, failed switch leg, or a blown fuse at the branch disconnect. Trace the supply from the panel to the fixture. Use a non-contact tester at each junction box in the run.",
                            children: [],
                          },
                        },
                        {
                          label: "Voltage present",
                          node: {
                            id: "i12",
                            type: "conclusion",
                            text: "Likely cause: Dead driver — input voltage present but no output. Replace the driver with an exact match (same wattage, voltage range, current output). Do not upsize the driver; it will overdrive the LED array and cause premature failure.",
                            children: [],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              label: "Flickering",
              node: {
                id: "i13",
                type: "check",
                text: "Is the flickering constant or does it happen at a specific time (startup, dimming, after running for 30+ minutes)?",
                children: [
                  {
                    label: "Only when dimming",
                    node: {
                      id: "i14",
                      type: "conclusion",
                      text: "Likely cause: Dimmer incompatibility. LED drivers require a compatible 0-10V or TRIAC dimmer — a legacy incandescent dimmer will cause flicker. Check the dimmer model against the driver's compatibility list. Replace the dimmer if not listed.",
                      children: [],
                    },
                  },
                  {
                    label: "After 30+ minutes warm",
                    node: {
                      id: "i15",
                      type: "conclusion",
                      text: "Likely cause: Thermal-induced driver instability — the driver is marginal and loses regulation as it heats. This often precedes full failure. Replace the driver proactively. Inspect the heatsink path for debris or paint buildup.",
                      children: [],
                    },
                  },
                  {
                    label: "Constant flicker",
                    node: {
                      id: "i16",
                      type: "conclusion",
                      text: "Likely cause: Loose wire connection causing intermittent contact. Inspect all wire nuts and push-in connectors at the fixture and the nearest junction box. Re-terminate any loose connections with a proper crimp or wire nut. Constant flicker is almost never a driver fault.",
                      children: [],
                    },
                  },
                ],
              },
            },
            {
              label: "Wrong color or dim",
              node: {
                id: "i17",
                type: "check",
                text: "Is the fixture within its rated lifespan (check install date against the L70 rating on the spec sheet)?",
                children: [
                  {
                    label: "Past rated life",
                    node: {
                      id: "i18",
                      type: "conclusion",
                      text: "Likely cause: Normal end-of-life lumen depreciation and color shift. Document the measured illuminance and CCT, compare to the original photometric report, and schedule replacement. This is not a defect — it is expected performance degradation.",
                      children: [],
                    },
                  },
                  {
                    label: "Within rated life",
                    node: {
                      id: "i19",
                      type: "conclusion",
                      text: "Likely cause: Premature LED array degradation — often caused by chronic overtemperature or a driver outputting above rated current. Measure driver output current. Compare to the LED array's rated forward current. If the driver is overdriving the array, replace both driver and array, and investigate why the original spec was wrong.",
                      children: [],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
};

export const SEED_TREES: Record<string, SavedTree> = {
  "seed-diesel-1": DIESEL_SEED,
  "seed-inspection-1": INSPECTION_SEED,
};
