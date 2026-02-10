
import React from 'react';

export const CONSTITUTION = `
ARTICLE I: THE SUPREMACY OF INSTITUTION
The Party is a permanent institution governed by rules, not personalities. No individual, regardless of rank, is above the Constitutional framework.

ARTICLE II: SEPARATION OF POWERS
1. Xubin (Members): The sovereign source of ideas. No direct execution power.
2. Committees: Filters of expertise. No final approval power.
3. Gole Dhexe (Central Council): Synthesizers of strategy. No implementation power.
4. Gole Sare (Supreme Council): Guardians of the vision. Limited pause/return authority. Zero executive authority.
5. Fulinta (Executive): Pure implementers. Zero policy-making authority.
6. Kormeer (Oversight): The eyes of the institution. Total transparency access.

ARTICLE III: TERM LIMITS & ROTATION
No member shall serve in the same committee or council role for more than two consecutive terms. A 'cooling-off' period of one full term is required before re-election to the same organ.

ARTICLE IV: IMMUTABLE MEMORY
No governance decision, vote, or audit log shall ever be deleted. Errors must be corrected via new entries, preserving the original error in history.

ARTICLE V: ANTI-CAPTURE
The Oversight Body (Kormeer) is triggered automatically by:
- Power concentration (same individuals approving multiple layers).
- Regional imbalance exceeding 15% variance.
- Declining Xubin participation (below 40%).
`;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  'General Member (Xubin)': ['Submit Ideas', 'Vote in Primaries', 'View Audit Logs'],
  'Sector Committee': ['Filter Ideas', 'Merge Proposals', 'Assign Technical Weight'],
  'Central Council (Gole Dhexe)': ['Synthesize Proposals', 'Debate Strategy', 'Draft Policy'],
  'Supreme Council (Gole Sare)': ['Final Approval', 'Pause Execution', 'Guard Constitution'],
  'Executive Body (Fulinta)': ['Define KPIs', 'Manage Projects', 'Report Implementation'],
  'Independent Oversight (Kormeer)': ['Audit Everything', 'Flag Risks', 'Monitor Capture']
};
