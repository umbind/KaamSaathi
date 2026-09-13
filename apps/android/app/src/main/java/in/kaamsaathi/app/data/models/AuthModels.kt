package in.kaamsaathi.app.data.models

data class OtpChallengeResponse(
    val maskedPhoneNumber: String,
    val cooldownSeconds: Int,
    val expiresAt: String
)

data class SessionTokens(
    val accessToken: String,
    val refreshToken: String,
    val tokenType: String = "Bearer",
    val expiresInSeconds: Int = 900
)

data class UserSession(
    val userId: String,
    val primaryRole: String,
    val roles: List<String>,
    val preferredLanguage: String,
    val profileCompleted: Boolean
)

data class CustomerProfileData(
    val name: String,
    val district: String,
    val locality: String,
    val pincode: String,
    val preferredLanguage: String
)

data class ProviderOnboardData(
    val primaryTrade: String,
    val experienceYears: Int,
    val district: String,
    val serviceRadiusKm: Int
)

val UP_DISTRICTS = listOf(
    "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh",
    "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti",
    "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah",
    "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad",
    "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun",
    "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi",
    "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura",
    "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh",
    "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar",
    "Shahjahanpur", "Shamli", "Shrawasti", "Siddharthnagar", "Sitapur", "Sonbhadra",
    "Sultanpur", "Unnao", "Varanasi"
)
