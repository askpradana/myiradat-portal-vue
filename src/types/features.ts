/**
 * Interface for a single feature in the features section
 */
export interface Feature {
  /** Unique identifier for the feature */
  id: string
  /** Feature title displayed prominently */
  title: string
  /** Detailed description of the feature */
  description: string
  /** Lucide icon name (in kebab-case) */
  icon: string
  /** Color theme for the icon background */
  iconColor: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'gray' | 'indigo' | 'teal'
}

/**
 * Interface for the features data structure
 */
export interface FeaturesData {
  /** Array of features to display */
  features: Feature[]
}

/**
 * Props interface for FeatureCard component
 */
export interface FeatureCardProps {
  /** Feature data to display */
  feature: Feature
  /** Position in set for accessibility (1-based) */
  ariaPosinset?: number
  /** Total number of items in set for accessibility */
  ariaSetsize?: number
}

/**
 * Color mapping for icon backgrounds and text colors
 */
export type FeatureIconColorClasses = Record<Feature['iconColor'], string>

/**
 * Available Lucide icons for features (commonly used ones)
 */
export type FeatureIconName =
  | 'clipboard-list'
  | 'zap'
  | 'users'
  | 'target'
  | 'bar-chart-3'
  | 'calendar'
  | 'message-circle'
  | 'file-text'
  | 'settings'
  | 'shield'
  | 'globe'
  | 'clock'
  | 'trending-up'
  | 'database'
  | 'mail'
  | 'smartphone'
  | 'heart'
  | 'graduation-cap'
  | 'building'

/**
 * Feature grid layout configuration
 */
export interface FeatureGridConfig {
  /** Number of columns on desktop */
  desktopColumns: number
  /** Number of columns on tablet */
  tabletColumns: number
  /** Number of columns on mobile */
  mobileColumns: number
  /** Gap between grid items */
  gap: 'sm' | 'md' | 'lg'
  /** Minimum height for feature cards */
  minHeight: string
}