// Client-side PDF generation — no backend needed
import { type PlantWithRelations } from '@/types';
import { PDF_FOOTER_CTA, APP } from '@/lib/constants';

export async function generatePlantPDF(plant: PlantWithRelations): Promise<void> {
  // Dynamically import to avoid SSR and reduce bundle
  const { pdf, Document, Page, Text, View, Image, StyleSheet, Link } =
    await import('@react-pdf/renderer');

  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#FAFAF5',
      padding: 40,
      fontFamily: 'Helvetica',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 24,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E5DED4',
    },
    farmName: {
      fontSize: 10,
      color: '#1B5E1B',
      fontFamily: 'Helvetica-Bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    plantName: {
      fontSize: 28,
      color: '#1B5E1B',
      fontFamily: 'Helvetica-Bold',
      marginBottom: 4,
    },
    scientificName: {
      fontSize: 14,
      color: '#6B7280',
      fontStyle: 'italic',
      marginBottom: 16,
    },
    qrSection: {
      alignItems: 'center',
      marginBottom: 24,
    },
    qrImage: {
      width: 120,
      height: 120,
    },
    qrLabel: {
      fontSize: 8,
      color: '#6B7280',
      marginTop: 6,
      textAlign: 'center',
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      color: '#1B5E1B',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 6,
      paddingBottom: 4,
      borderBottomWidth: 0.5,
      borderBottomColor: '#D8EDD8',
    },
    body: {
      fontSize: 11,
      color: '#374151',
      lineHeight: 1.6,
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: 'center',
      fontSize: 9,
      color: '#9CA3AF',
      borderTopWidth: 0.5,
      borderTopColor: '#E5DED4',
      paddingTop: 10,
    },
    badge: {
      backgroundColor: '#D8EDD8',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      marginRight: 6,
      marginBottom: 4,
    },
    badgeText: {
      fontSize: 9,
      color: '#1B5E1B',
      fontFamily: 'Helvetica-Bold',
    },
    badgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 8,
    },
  });

  const tags = plant.plant_tags ?? [];

  const PlantDocument = () => (
    <Document
      title={plant.name}
      author={APP.name}
      subject={`Plant profile — ${plant.name}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.farmName}>{APP.name}</Text>
            <Text style={{ fontSize: 8, color: '#9CA3AF', marginTop: 2 }}>Plant Profile</Text>
          </View>
          <Text style={{ fontSize: 8, color: '#9CA3AF' }}>
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </View>

        {/* Plant Name */}
        <Text style={styles.plantName}>{plant.name}</Text>
        {plant.scientific_name && (
          <Text style={styles.scientificName}>{plant.scientific_name}</Text>
        )}

        {/* Category / Tags */}
        <View style={styles.badgeRow}>
          {plant.plant_categories?.name && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{plant.plant_categories.name}</Text>
            </View>
          )}
          {tags.slice(0, 4).map((t) => (
            <View key={t.id} style={styles.badge}>
              <Text style={styles.badgeText}>{t.tag}</Text>
            </View>
          ))}
        </View>

        {/* QR Code */}
        {plant.qr_url && (
          <View style={styles.qrSection}>
            <Image src={plant.qr_url} style={styles.qrImage} />
            <Text style={styles.qrLabel}>Scan to explore this plant digitally</Text>
          </View>
        )}

        {/* Overview */}
        {plant.short_desc && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.body}>{plant.short_desc}</Text>
          </View>
        )}

        {/* Medicinal Uses */}
        {plant.medicinal_uses && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medicinal Uses</Text>
            <Text style={styles.body}>{plant.medicinal_uses}</Text>
          </View>
        )}

        {/* Folklore */}
        {plant.folklore && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Folklore & Tradition</Text>
            <Text style={{ ...styles.body, fontStyle: 'italic', color: '#6B7280' }}>
              &ldquo;{plant.folklore}&rdquo;
            </Text>
          </View>
        )}

        {/* Wikipedia */}
        {plant.wikipedia_url && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learn More</Text>
            <Link src={plant.wikipedia_url} style={{ fontSize: 10, color: '#1B5E1B' }}>
              {plant.wikipedia_url}
            </Link>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>{PDF_FOOTER_CTA}</Text>
      </Page>
    </Document>
  );

  const blob = await pdf(<PlantDocument />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${plant.name.replace(/\s+/g, '-').toLowerCase()}-profile.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
