import { useEffect } from 'react'
import { siteTranslation } from './__generated__/siteTranslation'
import { gql, useLazyQuery } from '@apollo/client'
import i18n from 'i18next'
import { initReactI18next, TFunction } from 'react-i18next'
import { LanguageTranslation } from '../__generated__/globalTypes'
import { authToken } from './helpers/authentication'

export type TranslationFn = TFunction<'translation'>

export function setupLocalization(): void {
  i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: {
          'Welcome to React': 'Welcome to React and react-i18next',
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    returnNull: false,

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: process.env.NODE_ENV === 'production',
    },
  })
}

const SITE_TRANSLATION = gql`
  query siteTranslation {
    myUserPreferences {
      id
      language
    }
  }
`

export const loadTranslations = () => {
  const [loadLang, { data }] = useLazyQuery<siteTranslation>(SITE_TRANSLATION)

  useEffect(() => {
    if (authToken()) {
      loadLang()
    }
  }, [authToken()])

  useEffect(() => {
    const language = data?.myUserPreferences.language
    if (language == null) {
      i18n.changeLanguage('en')
      return
    }

    switch (data?.myUserPreferences.language) {
      case LanguageTranslation.Danish:
        import('../extractedTranslations/da/translation.json').then(danish => {
          i18n.addResourceBundle('da', 'translation', danish)
          i18n.changeLanguage('da')
        })
        break
      case LanguageTranslation.English:
        import('../extractedTranslations/en/translation.json').then(english => {
          i18n.addResourceBundle('en', 'translation', english)
          i18n.changeLanguage('en')
        })
        break
      case LanguageTranslation.French:
        import('../extractedTranslations/fr/translation.json').then(english => {
          i18n.addResourceBundle('fr', 'translation', english)
          i18n.changeLanguage('fr')
        })
        break
    }
  }, [data?.myUserPreferences.language])
}
