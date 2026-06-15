variable "environment" {}
variable "namespace" {}

variable "postgres_username" {}
variable "postgres_password" {
  sensitive = true
}

variable "kafka_enabled" {
  default = true
}

variable "monitoring_enabled" {
  default = true
}