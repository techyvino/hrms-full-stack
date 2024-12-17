'use client'

import { EyeClosed } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export default function EmployeeForm() {
  const [formData, setFormData] = useState({
    name: 'Vinoth',
    password: 'user1234',
    dob: '1999-05-16',
    gender: 'Male',
    marital_status: 'Married',
    is_a_manager: false,
    spouse_name: '',
    spouse_dob: '',
    number_of_dependents: 0,
    joined_date: '2024-02-01',
    emergency_contact_name: 'Archu',
    emergency_contact_no: '9876543210',
    alternate_contact_name: 'mani',
    alternate_contact_no: '8765432109',
    temporary_address: '123 Temporary St.',
    temporary_city: 'Metropolis',
    temporary_state: 'State',
    temporary_country: 'Country',
    temporary_postal_code: '12345',
    permanent_address: '456 Permanent St.',
    permanent_city: 'Gotham',
    permanent_state: 'State',
    permanent_country: 'Country',
    permanent_postal_code: '67890',
    mobile_no: '9123579202',
    email: 'vino@example.com',
    department: 'Engineering',
    designation: 'Software Engineer',
    hobbies: 'Reading, Hiking',
    known_languages: 'English, Spanish',
    identification_type: 'Aadhaar Card',
    identification_number: '1234-5678-9012',
    site_id: 1,
    platform: 'Windows',
    operating_system: 'Windows 11',
    os_version: '22H2',
    manufacturer: 'Dell',
    device_name: "John's Laptop",
    device_model: 'XPS 13',
    role_id: 1,
    live_tracker_enabled: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   console.log(formData)
  //   // Here you would typically send the data to your backend
  // }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Information Form</CardTitle>
        <CardDescription>Please fill out all the required information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input required id="name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                required
                classNames={{
                  iconWrapper: 'text-gray-500 text-lg',
                }}
                icon={<EyeClosed />}
                iconPosition="left"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input required id="dob" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                defaultValue={formData.gender}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="male" value="Male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="female" value="Female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="other" value="Other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="marital_status">Marital Status</Label>
              <Select
                name="marital_status"
                value={formData.marital_status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, marital_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_a_manager">Is a Manager</Label>
              <Switch
                checked={formData.is_a_manager}
                id="is_a_manager"
                onCheckedChange={handleSwitchChange('is_a_manager')}
              />
            </div>
          </div>
        </div>

        {/* Spouse Information (conditionally rendered) */}
        {formData.marital_status === 'Married' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Spouse Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="spouse_name">Spouse Name</Label>
                <Input id="spouse_name" name="spouse_name" value={formData.spouse_name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spouse_dob">Spouse Date of Birth</Label>
                <Input
                  id="spouse_dob"
                  name="spouse_dob"
                  type="date"
                  value={formData.spouse_dob}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Employment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Employment Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="joined_date">Joined Date</Label>
              <Input
                required
                id="joined_date"
                name="joined_date"
                type="date"
                value={formData.joined_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                required
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                required
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_id">Site ID</Label>
              <Input
                required
                id="site_id"
                name="site_id"
                type="number"
                value={formData.site_id}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role_id">Role ID</Label>
              <Input
                required
                id="role_id"
                name="role_id"
                type="number"
                value={formData.role_id}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mobile_no">Mobile Number</Label>
              <Input required id="mobile_no" name="mobile_no" value={formData.mobile_no} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                required
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
              <Input
                required
                id="emergency_contact_name"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_no">Emergency Contact Number</Label>
              <Input
                required
                id="emergency_contact_no"
                name="emergency_contact_no"
                value={formData.emergency_contact_no}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alternate_contact_name">Alternate Contact Name</Label>
              <Input
                id="alternate_contact_name"
                name="alternate_contact_name"
                value={formData.alternate_contact_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alternate_contact_no">Alternate Contact Number</Label>
              <Input
                id="alternate_contact_no"
                name="alternate_contact_no"
                value={formData.alternate_contact_no}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Address Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="temporary_address">Temporary Address</Label>
              <Textarea
                required
                id="temporary_address"
                name="temporary_address"
                value={formData.temporary_address}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanent_address">Permanent Address</Label>
              <Textarea
                required
                id="permanent_address"
                name="permanent_address"
                value={formData.permanent_address}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temporary_city">Temporary City</Label>
              <Input
                required
                id="temporary_city"
                name="temporary_city"
                value={formData.temporary_city}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanent_city">Permanent City</Label>
              <Input
                required
                id="permanent_city"
                name="permanent_city"
                value={formData.permanent_city}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temporary_state">Temporary State</Label>
              <Input
                required
                id="temporary_state"
                name="temporary_state"
                value={formData.temporary_state}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanent_state">Permanent State</Label>
              <Input
                required
                id="permanent_state"
                name="permanent_state"
                value={formData.permanent_state}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temporary_country">Temporary Country</Label>
              <Input
                required
                id="temporary_country"
                name="temporary_country"
                value={formData.temporary_country}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanent_country">Permanent Country</Label>
              <Input
                required
                id="permanent_country"
                name="permanent_country"
                value={formData.permanent_country}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temporary_postal_code">Temporary Postal Code</Label>
              <Input
                required
                id="temporary_postal_code"
                name="temporary_postal_code"
                value={formData.temporary_postal_code}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanent_postal_code">Permanent Postal Code</Label>
              <Input
                required
                id="permanent_postal_code"
                name="permanent_postal_code"
                value={formData.permanent_postal_code}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hobbies">Hobbies</Label>
              <Input id="hobbies" name="hobbies" value={formData.hobbies} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="known_languages">Known Languages</Label>
              <Input
                id="known_languages"
                name="known_languages"
                value={formData.known_languages}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identification_type">Identification Type</Label>
              <Input
                required
                id="identification_type"
                name="identification_type"
                value={formData.identification_type}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identification_number">Identification Number</Label>
              <Input
                required
                id="identification_number"
                name="identification_number"
                value={formData.identification_number}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Device Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Device Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input required id="platform" name="platform" value={formData.platform} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operating_system">Operating System</Label>
              <Input
                required
                id="operating_system"
                name="operating_system"
                value={formData.operating_system}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="os_version">OS Version</Label>
              <Input
                required
                id="os_version"
                name="os_version"
                value={formData.os_version}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                required
                id="manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device_name">Device Name</Label>
              <Input
                required
                id="device_name"
                name="device_name"
                value={formData.device_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device_model">Device Model</Label>
              <Input
                required
                id="device_model"
                name="device_model"
                value={formData.device_model}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Other Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Other Settings</h3>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.live_tracker_enabled}
              id="live_tracker_enabled"
              onCheckedChange={handleSwitchChange('live_tracker_enabled')}
            />
            <Label htmlFor="live_tracker_enabled">Enable Live Tracker</Label>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit">
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}
