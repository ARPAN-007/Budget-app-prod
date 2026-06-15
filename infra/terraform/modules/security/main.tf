resource "kubernetes_pod_security_policy" "restricted" {
  metadata {
    name = "finops-restricted"
  }

  spec {
    privileged = false

    run_as_user {
      rule = "MustRunAsNonRoot"
    }

    se_linux {
      rule = "RunAsAny"
    }

    fs_group {
      rule = "RunAsAny"
    }

    supplemental_groups {
      rule = "RunAsAny"
    }

    volumes = [
      "configMap",
      "secret",
      "persistentVolumeClaim"
    ]
  }
}