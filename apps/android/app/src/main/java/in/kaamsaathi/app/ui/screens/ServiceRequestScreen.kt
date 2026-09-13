package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ServiceRequestScreen(
    categoryTitle: String = "Electrician / बिजली मिस्त्री",
    initialDistrict: String = "Lucknow",
    isHindi: Boolean = true,
    isLoading: Boolean = false,
    errorMessage: String? = null,
    onBack: () -> Unit,
    onSubmitRequest: (
        description: String,
        scheduleWindow: String,
        locality: String,
        district: String,
        pinCode: String
    ) -> Unit
) {
    var description by remember { mutableStateOf("") }
    var selectedSchedule by remember { mutableStateOf("Morning 9am - 12pm") }
    var locality by remember { mutableStateOf("") }
    var district by remember { mutableStateOf(initialDistrict) }
    var pinCode by remember { mutableStateOf("") }
    var hasSimulatedPhoto by remember { mutableStateOf(false) }

    val scheduleOptions = listOf(
        "Urgent Today (तत्काल आज)",
        "Morning 9am - 12pm",
        "Afternoon 12pm - 4pm",
        "Evening 4pm - 8pm"
    )

    val isValid = description.trim().isNotBlank() &&
                  locality.trim().isNotBlank() &&
                  pinCode.trim().length == 6 &&
                  pinCode.all { it.isDigit() }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = KaamBackground
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Top App Bar
            TopAppBar(
                title = {
                    Text(
                        text = if (isHindi) "सेवा अनुरोध ($categoryTitle)" else "Request $categoryTitle",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = KaamSurface,
                    titleContentColor = KaamTextPrimary
                )
            )

            LazyColumn(
                modifier = Modifier
                    .weight(1f)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Privacy Banner (Phased address disclosure)
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = KaamSecondaryTeal.copy(alpha = 0.12f)
                        )
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.Lock,
                                contentDescription = "Privacy Protected",
                                tint = KaamSecondaryTeal,
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(
                                text = if (isHindi)
                                    "गोपनीयता सुरक्षा: कोटेशन स्वीकार करने से पहले कारीगर को आपका फ़ोन नंबर या घर का पूरा पता नहीं दिखाया जाएगा (केवल इलाका व पिन कोड दिखेगा)।"
                                else
                                    "Privacy Protected: Providers see only your locality and PIN code. Your phone number and exact street address are hidden until you accept a quote.",
                                fontSize = 13.sp,
                                lineHeight = 18.sp,
                                color = KaamTextPrimary
                            )
                        }
                    }
                }

                // Problem Description
                item {
                    Text(
                        text = if (isHindi) "समस्या का विवरण (Problem Description)*" else "Problem Description*",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = KaamTextPrimary
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    OutlinedTextField(
                        value = description,
                        onValueChange = { description = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(110.dp),
                        placeholder = {
                            Text(
                                if (isHindi) "उदा. पंखा धीमा चल रहा है और स्पार्किंग हो रही है..."
                                else "e.g. Ceiling fan sparking and MCB tripping..."
                            )
                        },
                        shape = RoundedCornerShape(10.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = KaamPrimaryGreen,
                            focusedContainerColor = KaamSurface,
                            unfocusedContainerColor = KaamSurface
                        )
                    )
                }

                // Media Attachment (Simulation)
                item {
                    Text(
                        text = if (isHindi) "फोटो / वीडियो जोड़ें (वैकल्पिक)" else "Add Photo / Video (Optional)",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = KaamTextPrimary
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    OutlinedButton(
                        onClick = { hasSimulatedPhoto = !hasSimulatedPhoto },
                        modifier = Modifier
                            .fillMaxWidth()
                            .defaultMinSize(minHeight = 48.dp),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text(
                            if (hasSimulatedPhoto)
                                (if (isHindi) "✓ 1 फोटो जोड़ी गई (बदलें)" else "✓ 1 photo attached (Change)")
                            else
                                (if (isHindi) "+ समस्या की फोटो अपलोड करें" else "+ Attach Photo of Problem")
                        )
                    }
                }

                // Schedule Preference
                item {
                    Text(
                        text = if (isHindi) "सुविधाजनक समय (Preferred Time)*" else "Preferred Time*",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = KaamTextPrimary
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        scheduleOptions.forEach { opt ->
                            FilterChip(
                                selected = selectedSchedule == opt,
                                onClick = { selectedSchedule = opt },
                                label = { Text(opt, fontSize = 14.sp) },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .defaultMinSize(minHeight = 48.dp)
                            )
                        }
                    }
                }

                // Location Details (UP District, Locality, PIN)
                item {
                    Text(
                        text = if (isHindi) "स्थान विवरण (Location in UP)*" else "Location in UP*",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = KaamTextPrimary
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    OutlinedTextField(
                        value = district,
                        onValueChange = { district = it },
                        label = { Text(if (isHindi) "जिला (UP District)" else "UP District") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .defaultMinSize(minHeight = 56.dp),
                        shape = RoundedCornerShape(10.dp)
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = locality,
                        onValueChange = { locality = it },
                        label = { Text(if (isHindi) "इलाका / कॉलोनी (Locality)" else "Locality / Sector") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .defaultMinSize(minHeight = 56.dp),
                        shape = RoundedCornerShape(10.dp)
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = pinCode,
                        onValueChange = { if (it.length <= 6) pinCode = it },
                        label = { Text(if (isHindi) "पिन कोड (PIN Code)" else "6-digit PIN Code") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .defaultMinSize(minHeight = 56.dp),
                        shape = RoundedCornerShape(10.dp)
                    )
                }

                if (errorMessage != null) {
                    item {
                        Text(
                            text = errorMessage,
                            color = KaamErrorRed,
                            fontSize = 14.sp
                        )
                    }
                }
            }

            // Bottom CTA
            Surface(
                color = KaamSurface,
                shadowElevation = 8.dp
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Button(
                        onClick = {
                            if (isValid) {
                                onSubmitRequest(
                                    description,
                                    selectedSchedule,
                                    locality,
                                    district,
                                    pinCode
                                )
                            }
                        },
                        enabled = isValid && !isLoading,
                        modifier = Modifier
                            .fillMaxWidth()
                            .defaultMinSize(minHeight = 52.dp),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = KaamPrimaryGreen
                        )
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(24.dp),
                                color = KaamSurface,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Text(
                                text = if (isHindi) "अनुरोध भेजें (कारीगर खोजें)" else "Submit Request (Find Providers)",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
}
