variable "repo_url" {
  type = string
}

variable "app_path" {
  type = string
}

variable "namespace" {
  type = string
}

terraform {

  required_providers {

    kubectl = {
      source  = "gavinbunney/kubectl"
      version = "~> 1.14.0"
    }

  }
}
