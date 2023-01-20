terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "3.33.0"
    }
  }
}


provider "azurerm" {
  features {
  }
}

locals { # llamamos logica especial
  formated_location = replace(lower(var.location_name), " ", "")
  name_convention_base = "covachapp-${local.formated_location}-"
  }

# Create a resource group
resource "azurerm_resource_group" "resource_group" {
  name     = "${local.name_convention_base}rg"
  location = var.location_name 
}

