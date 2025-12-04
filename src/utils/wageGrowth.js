// Reusable wage growth reduction utilities
// Based on incidence literature (OECD, NBER, IZA)

/**
 * Calculates the annual wage growth reduction due to employer payroll tax changes.
 * Formula: ΔW_g = - β × (SSC_e / SSC_t) × ΔSSC_e
 * @param {number} beta - Shifting coefficient (0.5–0.9; higher for rigid markets)
 * @param {number} employerShare - Employer SSC as % of total tax wedge (0–100)
 * @param {number} deltaSSC - Change in employer payroll tax rate (%), can be negative (cuts) or positive (hikes)
 * @returns {number} Wage growth impact (%) — negative = drag, positive = boost
 */
export function wageGrowthReduction(beta, employerShare, deltaSSC) {
  if (typeof beta !== 'number' || !Number.isFinite(beta) || beta < 0.5 || beta > 1) {
    throw new Error('Beta must be a number between 0.5 and 1')
  }
  if (typeof employerShare !== 'number' || !Number.isFinite(employerShare) || employerShare < 0 || employerShare > 100) {
    throw new Error('Employer share must be between 0 and 100')
  }
  if (typeof deltaSSC !== 'number' || !Number.isFinite(deltaSSC)) {
    throw new Error('Delta SSC must be a finite number')
  }

  return -beta * (employerShare / 100) * deltaSSC
}

/**
 * Runs a simple sensitivity analysis over a set of ΔSSC values
 * @param {number} baseBeta
 * @param {number} baseShare
 * @param {number[]} deltaRange - Array of ΔSSC values in percentage points
 * @returns {{ deltaSSC: number, reduction: number }[]}
 */
export function sensitivityAnalysis(baseBeta, baseShare, deltaRange) {
  if (!Array.isArray(deltaRange)) {
    throw new Error('deltaRange must be an array of numbers')
  }
  return deltaRange.map((delta) => ({
    deltaSSC: delta,
    reduction: wageGrowthReduction(baseBeta, baseShare, delta)
  }))
}
