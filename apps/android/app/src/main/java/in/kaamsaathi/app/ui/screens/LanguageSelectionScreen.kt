package in.kaamsaathi.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.selection.selectable
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import in.kaamsaathi.app.R
import in.kaamsaathi.app.ui.theme.*

@Composable
fun LanguageSelectionScreen(
    currentLanguage: String,
    onLanguageSelected: (String) -> Unit,
    onContinue: () -> Unit
) {
    var selectedLanguage by remember { mutableStateOf(currentLanguage) }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = KaamBackground
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.Start
            ) {
                Spacer(modifier = Modifier.height(32.dp))

                Text(
                    text = stringResource(R.string.app_name),
                    color = KaamPrimary,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = stringResource(R.string.tagline),
                    color = KaamTextSecondary,
                    fontSize = 16.sp
                )

                Spacer(modifier = Modifier.height(48.dp))

                Text(
                    text = stringResource(R.string.select_language_title),
                    color = KaamTextPrimary,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.SemiBold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = stringResource(R.string.select_language_subtitle),
                    color = KaamTextSecondary,
                    fontSize = 14.sp
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Hindi Option (Min 56dp height for accessible tap target)
                LanguageCard(
                    title = "हिंदी (Hindi)",
                    subtitle = "उत्तर प्रदेश के कारीगरों और ग्राहकों के लिए",
                    isSelected = selectedLanguage == "hi",
                    onClick = {
                        selectedLanguage = "hi"
                        onLanguageSelected("hi")
                    }
                )

                Spacer(modifier = Modifier.height(16.dp))

                // English Option (Min 56dp height)
                LanguageCard(
                    title = "English",
                    subtitle = "For customers and service professionals",
                    isSelected = selectedLanguage == "en",
                    onClick = {
                        selectedLanguage = "en"
                        onLanguageSelected("en")
                    }
                )
            }

            // Primary Action Button (Min 52dp height for accessibility)
            Button(
                onClick = onContinue,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = KaamPrimary),
                shape = MaterialTheme.shapes.medium
            ) {
                Text(
                    text = stringResource(R.string.btn_continue),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = KaamSurface
                )
            }
        }
    }
}

@Composable
private fun LanguageCard(
    title: String,
    subtitle: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .selectable(
                selected = isSelected,
                onClick = onClick,
                role = Role.RadioButton
            ),
        shape = MaterialTheme.shapes.medium,
        colors = CardDefaults.cardColors(containerColor = KaamSurface),
        border = BorderStroke(
            width = if (isSelected) 2.dp else 1.dp,
            color = if (isSelected) KaamPrimary else KaamSurfaceBorder
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (isSelected) KaamPrimary else KaamTextPrimary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = subtitle,
                    fontSize = 14.sp,
                    color = KaamTextSecondary
                )
            }
            RadioButton(
                selected = isSelected,
                onClick = null,
                colors = RadioButtonDefaults.colors(selectedColor = KaamPrimary)
            )
        }
    }
}
