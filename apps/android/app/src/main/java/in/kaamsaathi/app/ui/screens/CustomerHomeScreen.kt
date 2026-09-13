package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.ui.theme.*

data class ServiceCategoryItem(
    val id: string,
    val nameEn: String,
    val nameHi: String,
    val icon: ImageVector,
    val colloquialAliases: List<String>
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomerHomeScreen(
    selectedDistrict: String = "Lucknow",
    isHindi: Boolean = true,
    onSelectCategory: (categoryId: String) -> Unit,
    onSearchQuerySubmit: (query: String) -> Unit,
    onChangeDistrict: () -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }

    val categories = remember {
        listOf(
            ServiceCategoryItem(
                id = "electrician",
                nameEn = "Electrician",
                nameHi = "बिजली मिस्त्री",
                icon = Icons.Default.Build,
                colloquialAliases = listOf("bijli", "wiring", "short circuit", "fan", "motor kharab")
            ),
            ServiceCategoryItem(
                id = "plumber",
                nameEn = "Plumber",
                nameHi = "नल मिस्त्री",
                icon = Icons.Default.Build,
                colloquialAliases = listOf("nal", "pipe leak", "water tank", "fitting", "tap")
            ),
            ServiceCategoryItem(
                id = "appliance_repair",
                nameEn = "Appliance Repair",
                nameHi = "उपकरण मरम्मत",
                icon = Icons.Default.Build,
                colloquialAliases = listOf("fridge", "washing machine", "geyser", "microwave", "ro repair")
            )
        )
    }

    val filteredCategories = remember(searchQuery) {
        val q = searchQuery.trim().lowercase()
        if (q.isEmpty()) categories
        else categories.filter { cat ->
            cat.nameEn.lowercase().contains(q) ||
            cat.nameHi.contains(q) ||
            cat.colloquialAliases.any { it.contains(q) }
        }
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = KaamBackground
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header with District Indicator
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = if (isHindi) "कामसाथी" else "KaamSaathi",
                            color = KaamPrimaryGreen,
                            fontSize = 26.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = if (isHindi) "भरोसेमंद कारीगर खोजें" else "Find Verified Local Trades",
                            color = KaamTextSecondary,
                            fontSize = 14.sp
                        )
                    }

                    AssistChip(
                        onClick = onChangeDistrict,
                        label = { Text(selectedDistrict, fontWeight = FontWeight.SemiBold) },
                        leadingIcon = {
                            Icon(
                                Icons.Default.LocationOn,
                                contentDescription = "District",
                                tint = KaamPrimaryGreen,
                                modifier = Modifier.size(18.dp)
                            )
                        },
                        modifier = Modifier.defaultMinSize(minHeight = 48.dp)
                    )
                }
            }

            // Search Bar with Transliterated Colloquial Query Support
            item {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .defaultMinSize(minHeight = 56.dp),
                    placeholder = {
                        Text(
                            if (isHindi) "खोजें: 'बिजली मिस्त्री', 'नल', 'geyser'..."
                            else "Search: 'bijli mistri', 'plumber', 'motor'..."
                        )
                    },
                    leadingIcon = {
                        Icon(Icons.Default.Search, contentDescription = "Search", tint = KaamTextSecondary)
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = KaamPrimaryGreen,
                        focusedContainerColor = KaamSurface,
                        unfocusedContainerColor = KaamSurface
                    )
                )
            }

            // Categories Section
            item {
                Text(
                    text = if (isHindi) "सेवा श्रेणियाँ (Services)" else "Service Categories",
                    color = KaamTextPrimary,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            item {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    filteredCategories.forEach { category ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .defaultMinSize(minHeight = 72.dp)
                                .clickable { onSelectCategory(category.id) },
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = KaamSurface),
                            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(48.dp)
                                        .background(
                                            color = KaamSecondaryTeal.copy(alpha = 0.15f),
                                            shape = RoundedCornerShape(8.dp)
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = category.icon,
                                        contentDescription = category.nameEn,
                                        tint = KaamSecondaryTeal,
                                        modifier = Modifier.size(28.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.width(16.dp))

                                Column {
                                    Text(
                                        text = if (isHindi) "${category.nameHi} (${category.nameEn})" else category.nameEn,
                                        fontSize = 17.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = KaamTextPrimary
                                    )
                                    Text(
                                        text = "उत्तर प्रदेश: ${category.colloquialAliases.take(3).joinToString(", ")}",
                                        fontSize = 13.sp,
                                        color = KaamTextSecondary
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Mandatory Trust Baseline Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = KaamWarningYellow.copy(alpha = 0.12f)
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.Top
                    ) {
                        Icon(
                            Icons.Default.Info,
                            contentDescription = "Trust Disclaimer",
                            tint = KaamWarningYellow,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = if (isHindi)
                                "मंच आपको स्वतंत्र कारीगरों से जोड़ता है। मंच कारीगर की योग्यता या व्यक्तिगत सुरक्षा की गारंटी नहीं देता है। प्रत्येक बैज यह स्पष्ट बताता है कि क्या सत्यापित किया गया है।"
                            else
                                "The platform connects you with independent service providers. The platform does not guarantee provider competence or personal safety. Every badge states exactly what was reviewed.",
                            fontSize = 13.sp,
                            lineHeight = 18.sp,
                            color = KaamTextPrimary
                        )
                    }
                }
            }
        }
    }
}
