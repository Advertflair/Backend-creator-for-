
export class CircularLogicDetector {
  /**
   * Detects if an agent is stuck in a loop based on its error history.
   * @param errorHistory An array of error message strings from recent attempts.
   * @returns `true` if a loop is detected, otherwise `false`.
   */
  static detect(errorHistory: string[]): boolean {
    if (errorHistory.length < 3) return false;
    
    const last3 = errorHistory.slice(-3);
    
    // Check if the last 3 errors are identical.
    if (last3[0] === last3[1] && last3[1] === last3[2]) {
      console.warn("⚠️ CIRCULAR LOGIC DETECTED: Same error repeated 3 times.");
      return true;
    }
    
    // Check for an alternating A -> B -> A error pattern.
    if (last3[0] === last3[2] && last3[0] !== last3[1]) {
      console.warn("⚠️ CIRCULAR LOGIC DETECTED: Alternating error pattern detected.");
      return true;
    }
    
    return false;
  }
}
