export type SupportedLanguage = 'hi' | 'en';
export declare const dictionaries: {
    hi: {
        app: {
            name: string;
            tagline: string;
        };
        common: {
            continue: string;
            submit: string;
            cancel: string;
            back: string;
            save: string;
            edit: string;
            delete: string;
            retry: string;
            loading: string;
            language: string;
            hindi: string;
            english: string;
        };
        auth: {
            phone_label: string;
            phone_placeholder: string;
            send_otp: string;
            otp_label: string;
            otp_sent_to: string;
            resend_otp: string;
            resend_in: string;
            verify_and_login: string;
            logout: string;
            role_customer: string;
            role_provider: string;
            switch_role: string;
        };
        customer: {
            welcome: string;
            profile_title: string;
            full_name: string;
            district: string;
            locality: string;
            pincode: string;
            address_line: string;
            masked_notifications: string;
            save_profile: string;
        };
        provider: {
            onboard_title: string;
            business_name: string;
            trade_title: string;
            experience: string;
            bio: string;
            availability_status: string;
            available: string;
            busy: string;
            offline: string;
        };
        categories: {
            electrician: string;
            plumber: string;
            appliance_repair: string;
        };
        errors: {
            generic: string;
            invalid_phone: string;
            invalid_otp: string;
            otp_expired: string;
            rate_limited: string;
            network_error: string;
        };
    };
    en: {
        app: {
            name: string;
            tagline: string;
        };
        common: {
            continue: string;
            submit: string;
            cancel: string;
            back: string;
            save: string;
            edit: string;
            delete: string;
            retry: string;
            loading: string;
            language: string;
            hindi: string;
            english: string;
        };
        auth: {
            phone_label: string;
            phone_placeholder: string;
            send_otp: string;
            otp_label: string;
            otp_sent_to: string;
            resend_otp: string;
            resend_in: string;
            verify_and_login: string;
            logout: string;
            role_customer: string;
            role_provider: string;
            switch_role: string;
        };
        customer: {
            welcome: string;
            profile_title: string;
            full_name: string;
            district: string;
            locality: string;
            pincode: string;
            address_line: string;
            masked_notifications: string;
            save_profile: string;
        };
        provider: {
            onboard_title: string;
            business_name: string;
            trade_title: string;
            experience: string;
            bio: string;
            availability_status: string;
            available: string;
            busy: string;
            offline: string;
        };
        categories: {
            electrician: string;
            plumber: string;
            appliance_repair: string;
        };
        errors: {
            generic: string;
            invalid_phone: string;
            invalid_otp: string;
            otp_expired: string;
            rate_limited: string;
            network_error: string;
        };
    };
};
export declare function t(key: string, lang?: SupportedLanguage, params?: Record<string, string | number>): string;
export declare const transliteratedAliases: Record<string, string[]>;
//# sourceMappingURL=index.d.ts.map