import { FloatLabel, type FloatLabelProps } from "../ui/float-label";

/**
 * WexFloatLabel - WEX Design System Floating Label Input
 *
 * A text input with a label that floats from inside the input
 * to above it when focused or containing a value. Follows the
 * PrimeNG FloatLabel "in" variant pattern.
 *
 * @example
 * // Basic usage
 * <WexFloatLabel label="Username" />
 *
 * // Sizes
 * <WexFloatLabel label="Small" size="sm" />
 * <WexFloatLabel label="Medium" size="md" />
 * <WexFloatLabel label="Large" size="lg" />
 *
 * // With icons
 * import { Mail, Search, Eye } from "lucide-react";
 * <WexFloatLabel label="Email" leftIcon={<Mail className="h-4 w-4" />} />
 * <WexFloatLabel label="Search" rightIcon={<Search className="h-4 w-4" />} />
 * <WexFloatLabel label="Password" leftIcon={<Lock />} rightIcon={<Eye />} />
 *
 * // With validation
 * <WexFloatLabel label="Email" type="email" invalid />
 *
 * // Controlled
 * <WexFloatLabel
 *   label="Password"
 *   type="password"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 * />
 */

export { FloatLabel as WexFloatLabel };
export type { FloatLabelProps as WexFloatLabelProps };

