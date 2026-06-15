variable "namespace" {
  description = "Namespace where network policy will be created"
  type        = string
}

variable "policy_name" {
  description = "Network policy name"
  type        = string
  default     = "finops-network-policy"
}