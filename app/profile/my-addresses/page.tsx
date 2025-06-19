"use client"

import React, { useEffect, useState } from "react"
import { PlusCircle, Pencil, Trash, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  createAddress,
  deleteAddress,
  getUserAddresses,
  updateAddress,
  setDefaultAddress,
  AddressFormValues,
} from "@/actions/addresses"

// Type for address from database schema
interface Address {
  id: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  type: "SHIPPING"
  userId: string
  createdAt: Date
  updatedAt: Date | null // Allow null for updatedAt
  isDefault?: boolean // Optional isDefault property
}

export default function MyAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const addressesPerPage = 4 // Show 4 addresses per page

  // Form for new/edit address
  const [formData, setFormData] = useState<AddressFormValues>({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    type: "SHIPPING",
    isDefault: false,
  })

  // Load addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true)
      try {
        const result = await getUserAddresses()
        if (result.addresses) {
          setAddresses(result.addresses)
        } else if (result.error) {
          if (result.error === "Unauthorized") {
            // Redirect to login page if unauthorized
            window.location.href = "/login?callbackUrl=/profile/my-addresses"
          } else {
            toast.error(result.error)
          }
        }
      } catch (error) {
        console.error("Failed to load addresses:", error)
        toast.error("Failed to load addresses")
      } finally {
        setLoading(false)
      }
    }

    fetchAddresses()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof AddressFormValues
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    })
  }

  const handleDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      isDefault: e.target.checked,
    })
  }

  const handleAddAddress = () => {
    setCurrentAddress(null)
    setIsEditing(false)
    setFormData({
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      type: "SHIPPING",
      isDefault: false,
    })
    setDialogOpen(true)
  }

  const handleEditAddress = (address: Address) => {
    setCurrentAddress(address)
    setIsEditing(true)
    setFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || "India",
      type: address.type,
      isDefault: false, // Set as needed if you implement default address functionality
    })
    setDialogOpen(true)
  }

  const handleDeleteAddress = (addressId: string) => {
    setAddressToDelete(addressId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteAddress = async () => {
    if (addressToDelete) {
      try {
        toast.loading("Deleting address...")
        const result = await deleteAddress(addressToDelete)
        toast.dismiss()

        if (result.success) {
          setAddresses(addresses.filter((addr) => addr.id !== addressToDelete))
          toast.success(result.message || "Address deleted successfully")
          setDeleteDialogOpen(false)
        } else {
          toast.error(result.error || "Failed to delete address")
        }
      } catch (error) {
        toast.dismiss()
        console.error("Error deleting address:", error)
        toast.error("Failed to delete address")
        setDeleteDialogOpen(false)
      }
    } else {
      setDeleteDialogOpen(false)
    }
  }

  const handleSaveAddress = async () => {
    // Use the proper validation from the addressSchema
    try {
      const action = isEditing ? "Updating" : "Adding"
      toast.loading(`${action} address...`)

      if (isEditing && currentAddress) {
        // Update existing address
        const result = await updateAddress(currentAddress.id, formData)
        toast.dismiss()

        if (result.success) {
          // Refresh addresses after update
          const updatedAddresses = await getUserAddresses()
          if (updatedAddresses.addresses) {
            setAddresses(updatedAddresses.addresses)
          }
          toast.success(result.message || "Address updated successfully")
          setDialogOpen(false)
        } else if (result.fieldErrors) {
          // Display field-specific validation errors
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors && errors.length > 0) {
              toast.error(`${field}: ${errors[0]}`)
            }
          })
        } else {
          toast.error(result.error || "Failed to update address")
        }
      } else {
        // Add new address
        const result = await createAddress(formData)
        toast.dismiss()

        if (result.success) {
          // Refresh addresses after creation
          const updatedAddresses = await getUserAddresses()
          if (updatedAddresses.addresses) {
            setAddresses(updatedAddresses.addresses)
          }
          toast.success(result.message || "Address added successfully")
          setDialogOpen(false)
        } else if (result.fieldErrors) {
          // Display field-specific validation errors
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors && errors.length > 0) {
              toast.error(`${field}: ${errors[0]}`)
            }
          })
        } else {
          toast.error(result.error || "Failed to add address")
        }
      }
    } catch (error) {
      toast.dismiss()
      console.error("Error saving address:", error)
      toast.error("Failed to save address")
    }
  }

  const handleMakeDefault = async (addressId: string) => {
    try {
      toast.loading("Setting as default address...")
      const result = await setDefaultAddress(addressId)
      if (result.success) {
        toast.dismiss()
        toast.success(result.message || "Address set as default")
        // Refresh addresses to show updated default status
        const updatedAddresses = await getUserAddresses()
        if (updatedAddresses.addresses) {
          setAddresses(updatedAddresses.addresses)
        }
      } else {
        toast.dismiss()
        toast.error(result.error || "Failed to set as default")
      }
    } catch (error) {
      toast.dismiss()
      console.error("Error setting default address:", error)
      toast.error("Failed to set address as default")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-[50vh]">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-brand text-white p-2 rounded-full">
          <MapPin className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">My Addresses</h1>
      </div>

      <div className="bg-green-50 border-l-4 border-brand p-4 mb-6">
        <p className="text-sm">
          <span className="font-semibold">Note:</span> Mangalore Homoeopathic
          Pharmacy is our registered business name. HomeoSouth is the digital
          brand representing our online presence.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <Button variant="outline" onClick={handleAddAddress}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your addresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium text-lg">No addresses saved yet</h3>
          <p className="text-gray-500 mt-2 mb-4">
            Add addresses to make checkout faster
          </p>
          <Button onClick={handleAddAddress}>Add New Address</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Show only the current page of addresses */}
            {addresses
              .slice(
                (currentPage - 1) * addressesPerPage,
                currentPage * addressesPerPage
              )
              .map((address) => (
                <Card
                  key={address.id}
                  className={`relative ${
                    address.isDefault ? "border-brand" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-brand" />
                      <span className="font-medium capitalize">
                        Shipping Address
                      </span>
                      {address.isDefault && (
                        <span className="bg-brand text-white text-xs px-2 py-0.5 rounded-full ml-2">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 mb-4">
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.state} - {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                    </div>

                    <div className="flex gap-2">
                      {" "}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAddress(address)}
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4 mr-1" /> Delete
                      </Button>
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMakeDefault(address.id)}
                          className="text-brand hover:bg-brand/10"
                        >
                          Set Default
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Pagination controls */}
          {addresses.length > addressesPerPage && (
            <div className="flex justify-center mt-8 space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {Array.from({
                length: Math.ceil(addresses.length / addressesPerPage),
              }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                  className={
                    currentPage === i + 1 ? "bg-brand hover:bg-brand/90" : ""
                  }
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      Math.ceil(addresses.length / addressesPerPage),
                      prev + 1
                    )
                  )
                }
                disabled={
                  currentPage === Math.ceil(addresses.length / addressesPerPage)
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Address Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="street">Address Line*</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange(e, "street")}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city">City*</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange(e, "city")}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State*</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange(e, "state")}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="postalCode">PIN Code*</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange(e, "postalCode")}
                />
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange(e, "country")}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={handleDefaultChange}
                  className="rounded border-gray-300 text-brand focus:ring-brand"
                />
                <Label htmlFor="isDefault" className="font-normal">
                  Set as default address
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAddress} className="w-full sm:w-auto">
              {isEditing ? "Update Address" : "Save Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this address? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteAddress}
              className="w-full sm:w-auto"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
