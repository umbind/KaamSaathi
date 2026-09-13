export interface CustomerProfileDto {
    id: string;
    user_id: string;
    full_name: string;
    district_id: string;
    locality_name: string;
    pin_code: string;
    masked_notifications: boolean;
    created_at: string;
    updated_at: string;
}
export interface UpdateCustomerProfilePayload {
    full_name: string;
    district_id: string;
    locality_name: string;
    pin_code: string;
    address_line?: string;
    masked_notifications?: boolean;
}
export interface UpdateLanguagePayload {
    language: 'hi' | 'en';
}
export declare const UP_DISTRICTS: readonly ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shrawasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"];
export type UpDistrict = typeof UP_DISTRICTS[number];
//# sourceMappingURL=customer.d.ts.map