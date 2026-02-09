// Message schema type for type-safe translations
export interface MessageSchema {
  auth: {
    welcome: {
      title: string
      description: string
    }
    form: {
      email: string
      password: string
      confirmPassword: string
      name: string
      phone: string
      enterEmail: string
      enterPassword: string
      enterName: string
      enterPhone: string
    }
    buttons: {
      signIn: string
      signUp: string
      pleaseWait: string
      forgotPassword: string
      backToLogin: string
      verify: string
      resendCode: string
    }
    register: {
      title: string
      description: string
      hasAccount: string
    }
    login: {
      noAccount: string
    }
    verification: {
      title: string
      description: string
      enterCode: string
      codeRequired: string
      invalidCode: string
    }
    messages: {
      success: string
      error: string
      emailVerificationRequired: string
      verifyEmailToContinue: string
    }
  }
  common: {
    actions: {
      save: string
      cancel: string
      delete: string
      edit: string
      create: string
      submit: string
      loading: string
      search: string
      filter: string
      reset: string
      back: string
      next: string
      previous: string
      close: string
      confirm: string
    }
    states: {
      loading: string
      noData: string
      error: string
      success: string
      empty: string
      searching: string
      saving: string
      deleting: string
      creating: string
    }
    navigation: {
      dashboard: string
      profile: string
      settings: string
      logout: string
      home: string
    }
    table: {
      actions: string
      noResults: string
      showing: string
      of: string
      entries: string
      previous: string
      next: string
    }
    validation: {
      required: string
      email: string
      minLength: string
      maxLength: string
    }
    brand: {
      name: string
      tagline: string
    }
    language: {
      comingSoon: string
    }
  }
  dashboard: {
    navigation: {
      dashboard: string
      userManagement: string
      services: string
      profile: string
      quiz: string
      results: string
    }
    header: {
      adminDashboard: string
      csDashboard: string
      iradat: string
      adminSubtitle: string
      csSubtitle: string
      welcomeSubtitle: string
    }
    admin: {
      users: {
        title: string
        createUser: string
        editUser: string
        deleteUser: string
        batchCreate: string
        userDetails: string
      }
    }
    user: {
      profile: {
        title: string
        editProfile: string
        personalInfo: string
        accountSettings: string
      }
      services: {
        title: string
        noServices: string
        linkService: string
        unlinkService: string
      }
    }
    quiz: {
      title: string
      takeQuiz: string
      viewResults: string
      completed: string
      inProgress: string
      notStarted: string
    }
  }
  homepage: {
    header: {
      brand: {
        name: string
        tagline: string
      }
      trust: {
        uptime: string
        certified: string
      }
      buttons: {
        signIn: string
        startFreeTrial: string
      }
    }
  }
}