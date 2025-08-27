import { computed, watch, ref, type ComputedRef, type Ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { ProfileFormSchema } from '@/lib/zod-schemas/ProfileFormSchema'
import { useUserProfile } from '@/composables/auth/useUserProfile'
import type { UpdateProfilePayload } from '@/api/users/updateProfile'

export type ProfileFormField = {
  value: Ref<string>
  errorMessage: Ref<string | undefined>
  meta: {
    dirty: boolean
    valid: boolean
    touched: boolean
  }
}

export type ProfileFormFields = {
  name: ProfileFormField
  email: ProfileFormField
  phone: ProfileFormField
}

export type UseProfileFormReturn = {
  // Form fields
  fields: ProfileFormFields
  
  // Form state
  isFormValid: ComputedRef<boolean>
  isFormDirty: ComputedRef<boolean>
  hasChanges: ComputedRef<boolean>
  isSubmitting: ComputedRef<boolean>
  
  // Edit mode state
  isEditing: Ref<boolean>
  enterEditMode: () => void
  exitEditMode: () => void
  cancelEdit: () => void
  
  // Form actions
  handleSubmit: (onSubmit: (values: UpdateProfilePayload) => void) => Promise<void>
  resetForm: () => void
  validateField: (field: keyof ProfileFormFields) => void
  
  // Form data
  getFormData: () => UpdateProfilePayload
  getChangedFields: () => UpdateProfilePayload
  setInitialValues: (data: Partial<UpdateProfilePayload>) => void
  
  // Validation
  errors: ComputedRef<Record<string, string | undefined>>
  meta: {
    valid: ComputedRef<boolean>
    dirty: ComputedRef<boolean>
    touched: ComputedRef<boolean>
  }
  
  // Confirmation dialog
  showConfirmDialog: Ref<boolean>
  confirmCancel: () => void
  dismissCancel: () => void
}

export function useProfileForm(): UseProfileFormReturn {
  const { user, isUpdating } = useUserProfile()
  
  // Edit mode state
  const isEditing = ref(false)
  const showConfirmDialog = ref(false)
  const originalValues = ref<Partial<UpdateProfilePayload> | null>(null)

  // Initialize form with validation schema
  const { 
    handleSubmit: veeHandleSubmit, 
    errors, 
    meta: formMeta,
    resetForm: veeResetForm,
    setValues,
    validateField: veeValidateField
  } = useForm({
    validationSchema: ProfileFormSchema,
    initialValues: {
      name: user.value?.name || '',
      email: user.value?.email || '',
      phone: user.value?.phone || '',
    },
  })

  // Form fields with validation
  const { value: name, errorMessage: nameError, meta: nameMeta } = useField<string>('name')
  const { value: email, errorMessage: emailError, meta: emailMeta } = useField<string>('email')
  const { value: phone, errorMessage: phoneError, meta: phoneMeta } = useField<string>('phone')

  // Create field objects
  const fields: ProfileFormFields = {
    name: {
      value: name,
      errorMessage: nameError,
      meta: {
        dirty: nameMeta.dirty,
        valid: nameMeta.valid,
        touched: nameMeta.touched
      }
    },
    email: {
      value: email,
      errorMessage: emailError,
      meta: {
        dirty: emailMeta.dirty,
        valid: emailMeta.valid,
        touched: emailMeta.touched
      }
    },
    phone: {
      value: phone,
      errorMessage: phoneError,
      meta: {
        dirty: phoneMeta.dirty,
        valid: phoneMeta.valid,
        touched: phoneMeta.touched
      }
    }
  }

  // Form state computeds
  const isFormValid = computed(() => formMeta.value.valid)
  const isFormDirty = computed(() => formMeta.value.dirty)
  const isSubmitting = computed(() => isUpdating.value)

  // Check if form has changes compared to original values (set when entering edit mode)
  const hasChanges = computed(() => {
    if (!originalValues.value) return false
    
    return (
      name.value !== originalValues.value.name ||
      email.value !== originalValues.value.email ||
      phone.value !== originalValues.value.phone
    )
  })

  // Edit mode actions
  const enterEditMode = () => {
    isEditing.value = true
    // Store original values for comparison and set form values
    const currentValues = {
      name: user.value?.name || '',
      email: user.value?.email || '',
      phone: user.value?.phone || '',
    }
    
    originalValues.value = currentValues
    
    // Set form values to current user data
    setValues(currentValues)
  }

  const exitEditMode = () => {
    isEditing.value = false
    originalValues.value = null
    clearDraft()
  }

  const cancelEdit = () => {
    if (hasChanges.value) {
      showConfirmDialog.value = true
    } else {
      exitEditMode()
      resetForm()
    }
  }

  const confirmCancel = () => {
    showConfirmDialog.value = false
    exitEditMode()
    resetForm()
  }

  const dismissCancel = () => {
    showConfirmDialog.value = false
  }

  // Utility to get only changed fields
  const getChangedFields = (): UpdateProfilePayload => {
    const changedFields: UpdateProfilePayload = {}
    
    if (!user.value || !originalValues.value) return changedFields
    
    if (name.value !== originalValues.value.name) {
      changedFields.name = name.value
    }
    if (email.value !== originalValues.value.email) {
      changedFields.email = email.value
    }
    if (phone.value !== originalValues.value.phone) {
      changedFields.phone = phone.value
    }
    
    return changedFields
  }

  // Form actions
  const handleSubmit = async (onSubmit: (values: UpdateProfilePayload) => void) => {
    console.log('handleSubmit called')
    console.log('Form meta:', formMeta.value)
    console.log('Original values:', originalValues.value)
    console.log('Current field values:', { name: name.value, email: email.value, phone: phone.value })
    
    await veeHandleSubmit(() => {
      const changedFields = getChangedFields()
      console.log('getChangedFields result:', changedFields)
      
      // Prevent empty payload
      if (Object.keys(changedFields).length === 0) {
        console.log('No changed fields, aborting submission')
        return
      }
      
      onSubmit(changedFields)
    })()
  }

  const resetForm = () => {
    veeResetForm({
      values: {
        name: user.value?.name || '',
        email: user.value?.email || '',
        phone: user.value?.phone || '',
      }
    })
  }

  const validateField = (field: keyof ProfileFormFields) => {
    veeValidateField(field)
  }

  const getFormData = (): UpdateProfilePayload => {
    return {
      name: name.value,
      email: email.value,
      phone: phone.value,
    }
  }

  const setInitialValues = (data: Partial<UpdateProfilePayload>) => {
    setValues({
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
    })
  }

  // Watch for user data changes and update form
  watch(
    () => user.value,
    (newUser) => {
      if (newUser && !isFormDirty.value) {
        setInitialValues({
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
        })
      }
    },
    { immediate: true }
  )

  // Auto-save draft to localStorage (optional)
  const saveDraft = () => {
    if (hasChanges.value) {
      const draftData = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        timestamp: Date.now()
      }
      localStorage.setItem('profile-form-draft', JSON.stringify(draftData))
    }
  }

  const loadDraft = () => {
    try {
      const draft = localStorage.getItem('profile-form-draft')
      if (draft) {
        const draftData = JSON.parse(draft)
        // Only load draft if it's less than 1 hour old
        if (Date.now() - draftData.timestamp < 60 * 60 * 1000) {
          setInitialValues(draftData)
        } else {
          localStorage.removeItem('profile-form-draft')
        }
      }
    } catch {
      localStorage.removeItem('profile-form-draft')
    }
  }

  const clearDraft = () => {
    localStorage.removeItem('profile-form-draft')
  }

  // Auto-save draft on changes (debounced)
  let draftTimeout: ReturnType<typeof setTimeout>
  watch(
    [name, email, phone],
    () => {
      clearTimeout(draftTimeout)
      draftTimeout = setTimeout(saveDraft, 1000) // Save after 1 second of inactivity
    }
  )

  // Load draft on initialization
  loadDraft()

  return {
    fields,
    
    isFormValid,
    isFormDirty,
    hasChanges,
    isSubmitting,
    
    // Edit mode state
    isEditing,
    enterEditMode,
    exitEditMode,
    cancelEdit,
    
    handleSubmit,
    resetForm,
    validateField,
    
    getFormData,
    getChangedFields,
    setInitialValues,
    
    errors,
    meta: {
      valid: computed(() => formMeta.value.valid),
      dirty: computed(() => formMeta.value.dirty),
      touched: computed(() => formMeta.value.touched)
    },
    
    // Confirmation dialog
    showConfirmDialog,
    confirmCancel,
    dismissCancel
  }
}