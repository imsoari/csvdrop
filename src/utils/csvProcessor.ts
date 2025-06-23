export interface CSVFile {
  id: string;
  name: string;
  data: string[][];
  headers: string[];
  rowCount: number;
  size: number;
  lastModified: Date;
}

export interface DataPointMapping {
  [key: string]: string; // maps standard field to actual column name
}

export interface ConsolidationOptions {
  method: 'merge' | 'union' | 'intersect';
  removeDuplicates: boolean;
  headerHandling: 'first' | 'all' | 'custom';
  customHeaders?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filterEmpty: boolean;
  dataPointSelection?: {
    enabled: boolean;
    selectedPoints: string[];
    mappings: { [fileId: string]: DataPointMapping };
  };
}

export interface ConsolidationResult {
  headers: string[];
  data: string[][];
  stats: {
    totalRows: number;
    duplicatesRemoved: number;
    emptyRowsRemoved: number;
    columnsAligned: number;
    processingTime: number;
    dataPointsConsolidated: number;
  };
}

// Standard data points that users commonly want to consolidate
export const STANDARD_DATA_POINTS: Record<string, {
  label: string;
  description: string;
  icon: string;
  commonHeaders: string[];
}> = {
  'first_name': {
    label: 'First Name',
    description: 'Person\'s first name',
    icon: '👤',
    commonHeaders: ['first_name', 'firstname', 'first', 'fname', 'given_name', 'forename']
  },
  'last_name': {
    label: 'Last Name', 
    description: 'Person\'s last name',
    icon: '👤',
    commonHeaders: ['last_name', 'lastname', 'last', 'lname', 'surname', 'family_name']
  },
  'full_name': {
    label: 'Full Name',
    description: 'Complete name',
    icon: '👤',
    commonHeaders: ['full_name', 'fullname', 'name', 'display_name', 'contact_name']
  },
  'email': {
    label: 'Email Address',
    description: 'Email contact information',
    icon: '📧',
    commonHeaders: ['email', 'email_address', 'e_mail', 'mail', 'contact_email', 'primary_email']
  },
  'phone': {
    label: 'Phone Number',
    description: 'Phone contact information',
    icon: '📞',
    commonHeaders: ['phone', 'phone_number', 'mobile', 'cell', 'telephone', 'contact_phone', 'primary_phone']
  },
  'address': {
    label: 'Address',
    description: 'Street address',
    icon: '🏠',
    commonHeaders: ['address', 'street_address', 'street', 'address_line_1', 'addr1', 'location']
  },
  'city': {
    label: 'City',
    description: 'City name',
    icon: '🏙️',
    commonHeaders: ['city', 'town', 'locality', 'municipality']
  },
  'state': {
    label: 'State/Province',
    description: 'State or province',
    icon: '🗺️',
    commonHeaders: ['state', 'province', 'region', 'state_province', 'administrative_area']
  },
  'zip_code': {
    label: 'ZIP/Postal Code',
    description: 'Postal code',
    icon: '📮',
    commonHeaders: ['zip', 'zip_code', 'postal_code', 'postcode', 'zipcode']
  },
  'country': {
    label: 'Country',
    description: 'Country name',
    icon: '🌍',
    commonHeaders: ['country', 'nation', 'country_code', 'country_name']
  },
  'company': {
    label: 'Company/Organization',
    description: 'Company or organization name',
    icon: '🏢',
    commonHeaders: ['company', 'organization', 'org', 'business', 'employer', 'company_name']
  },
  'job_title': {
    label: 'Job Title',
    description: 'Professional title or position',
    icon: '💼',
    commonHeaders: ['job_title', 'title', 'position', 'role', 'designation', 'occupation']
  },
  'department': {
    label: 'Department',
    description: 'Department or division',
    icon: '🏛️',
    commonHeaders: ['department', 'dept', 'division', 'team', 'unit']
  },
  'date_of_birth': {
    label: 'Date of Birth',
    description: 'Birth date',
    icon: '🎂',
    commonHeaders: ['date_of_birth', 'dob', 'birth_date', 'birthdate', 'birthday']
  },
  'age': {
    label: 'Age',
    description: 'Person\'s age',
    icon: '🔢',
    commonHeaders: ['age', 'years_old', 'current_age']
  },
  'gender': {
    label: 'Gender',
    description: 'Gender identity',
    icon: '⚧️',
    commonHeaders: ['gender', 'sex', 'gender_identity']
  },
  'website': {
    label: 'Website',
    description: 'Website URL',
    icon: '🌐',
    commonHeaders: ['website', 'url', 'web', 'homepage', 'site', 'web_address']
  },
  'social_media': {
    label: 'Social Media',
    description: 'Social media profiles',
    icon: '📱',
    commonHeaders: ['social_media', 'linkedin', 'twitter', 'facebook', 'instagram', 'social']
  },
  'notes': {
    label: 'Notes/Comments',
    description: 'Additional notes or comments',
    icon: '📝',
    commonHeaders: ['notes', 'comments', 'description', 'remarks', 'memo', 'additional_info']
  },
  'id': {
    label: 'ID/Reference',
    description: 'Unique identifier',
    icon: '🆔',
    commonHeaders: ['id', 'user_id', 'customer_id', 'reference', 'ref', 'identifier', 'uuid']
  },
  'created_date': {
    label: 'Created Date',
    description: 'Date record was created',
    icon: '📅',
    commonHeaders: ['created_date', 'created_at', 'date_created', 'created', 'date_added']
  },
  'modified_date': {
    label: 'Modified Date',
    description: 'Date record was last modified',
    icon: '📅',
    commonHeaders: ['modified_date', 'updated_at', 'last_modified', 'date_modified', 'updated']
  }
};

export class CSVProcessor {
  static parseCSV(text: string, filename: string): CSVFile {
    const startTime = performance.now();
    
    // Handle different line endings and clean the text
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedText.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error(`File "${filename}" appears to be empty`);
    }
    
    // Parse CSV with proper quote handling
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      let i = 0;
      
      while (i < line.length) {
        const char = line[i];
        
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            // Escaped quote
            current += '"';
            i += 2;
          } else {
            // Toggle quote state
            inQuotes = !inQuotes;
            i++;
          }
        } else if (char === ',' && !inQuotes) {
          // Field separator
          result.push(current.trim());
          current = '';
          i++;
        } else {
          current += char;
          i++;
        }
      }
      
      result.push(current.trim());
      return result;
    };
    
    const headers = parseCSVLine(lines[0]);
    const data = lines.slice(1).map(line => parseCSVLine(line));
    
    // Validate data consistency
    const inconsistentRows = data.filter(row => row.length !== headers.length);
    if (inconsistentRows.length > 0) {
      console.warn(`File "${filename}" has ${inconsistentRows.length} rows with inconsistent column count`);
    }
    
    // Normalize row lengths
    const normalizedData = data.map(row => {
      const normalized = [...row];
      while (normalized.length < headers.length) {
        normalized.push('');
      }
      return normalized.slice(0, headers.length);
    });
    
    const processingTime = performance.now() - startTime;
    console.log(`Parsed "${filename}" in ${processingTime.toFixed(2)}ms`);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: filename,
      data: normalizedData,
      headers,
      rowCount: normalizedData.length,
      size: text.length,
      lastModified: new Date()
    };
  }

  static suggestDataPointMappings(file: CSVFile): DataPointMapping {
    const mappings: DataPointMapping = {};
    
    Object.entries(STANDARD_DATA_POINTS).forEach(([dataPoint, config]) => {
      const matchedHeader = file.headers.find(header => {
        const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '_');
        return config.commonHeaders.some(commonHeader => 
          normalizedHeader.includes(commonHeader) || 
          commonHeader.includes(normalizedHeader) ||
          this.calculateSimilarity(normalizedHeader, commonHeader) > 0.8
        );
      });
      
      if (matchedHeader) {
        mappings[dataPoint] = matchedHeader;
      }
    });
    
    return mappings;
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  static consolidateFiles(files: CSVFile[], options: ConsolidationOptions): ConsolidationResult {
    const startTime = performance.now();
    const stats = {
      totalRows: 0,
      duplicatesRemoved: 0,
      emptyRowsRemoved: 0,
      columnsAligned: 0,
      processingTime: 0,
      dataPointsConsolidated: 0
    };
    
    if (files.length === 0) {
      throw new Error('No files to consolidate');
    }
    
    // Step 1: Determine final headers based on data point selection or traditional method
    let finalHeaders: string[] = [];
    let useDataPointConsolidation = false;
    
    if (options.dataPointSelection?.enabled && options.dataPointSelection.selectedPoints.length > 0) {
      // Use data point-based consolidation
      useDataPointConsolidation = true;
      finalHeaders = options.dataPointSelection.selectedPoints.map(point => 
        STANDARD_DATA_POINTS[point]?.label || point
      );
      stats.dataPointsConsolidated = finalHeaders.length;
    } else {
      // Use traditional header handling
      switch (options.headerHandling) {
        case 'first': {
          finalHeaders = [...files[0].headers];
          break;
        }
          
        case 'all': {
          const headerSet = new Set<string>();
          files.forEach(file => {
            file.headers.forEach(header => headerSet.add(header.trim()));
          });
          finalHeaders = Array.from(headerSet).sort();
          stats.columnsAligned = finalHeaders.length;
          break;
        }
          
        case 'custom': {
          if (options.customHeaders && options.customHeaders.length > 0) {
            finalHeaders = [...options.customHeaders];
          } else {
            finalHeaders = [...files[0].headers];
          }
          break;
        }
      }
    }
    
    // Step 2: Consolidate data based on method and data point selection
    let consolidatedData: string[][] = [];
    
    if (useDataPointConsolidation) {
      // Data point-based consolidation
      files.forEach(file => {
        const fileMapping = options.dataPointSelection!.mappings[file.id] || {};
        const alignedData = this.alignDataToDataPoints(file, options.dataPointSelection!.selectedPoints, fileMapping);
        
        if (options.method === 'union') {
          // Remove duplicates based on all columns
          const seenRows = new Set<string>();
          alignedData.forEach(row => {
            const rowKey = row.join('|');
            if (!seenRows.has(rowKey)) {
              seenRows.add(rowKey);
              consolidatedData.push(row);
            } else {
              stats.duplicatesRemoved++;
            }
          });
        } else {
          consolidatedData.push(...alignedData);
        }
      });
      
      if (options.method === 'intersect' && files.length > 1) {
        // For intersection with data points, find rows that appear in all files
        const rowCounts = new Map<string, number>();
        const allFileData: string[][][] = [];
        
        files.forEach(file => {
          const fileMapping = options.dataPointSelection!.mappings[file.id] || {};
          const alignedData = this.alignDataToDataPoints(file, options.dataPointSelection!.selectedPoints, fileMapping);
          allFileData.push(alignedData);
          
          const fileRows = new Set<string>();
          alignedData.forEach(row => {
            const rowKey = row.join('|');
            if (!fileRows.has(rowKey)) {
              fileRows.add(rowKey);
              rowCounts.set(rowKey, (rowCounts.get(rowKey) || 0) + 1);
            }
          });
        });
        
        // Only keep rows that appear in all files
        const intersectRows = Array.from(rowCounts.entries())
          .filter(([rowKey, count]) => rowKey && count === files.length)
          .map(([rowKey]) => rowKey.split('|'));
        
        consolidatedData = intersectRows;
      }
    } else {
      // Traditional consolidation method
      switch (options.method) {
        case 'merge': {
          files.forEach(file => {
            const alignedData = this.alignDataToHeaders(file, finalHeaders);
            consolidatedData.push(...alignedData);
          });
          break;
        }
          
        case 'union': {
          const seenRows = new Set<string>();
          files.forEach(file => {
            const alignedData = this.alignDataToHeaders(file, finalHeaders);
            alignedData.forEach(row => {
              const rowKey = row.join('|');
              if (!seenRows.has(rowKey)) {
                seenRows.add(rowKey);
                consolidatedData.push(row);
              } else {
                stats.duplicatesRemoved++;
              }
            });
          });
          break;
        }
          
        case 'intersect': {
          if (files.length === 1) {
            consolidatedData = this.alignDataToHeaders(files[0], finalHeaders);
          } else {
            const rowCounts = new Map<string, number>();
            
            files.forEach(file => {
              const alignedData = this.alignDataToHeaders(file, finalHeaders);
              const fileRows = new Set<string>();
              
              alignedData.forEach(row => {
                const rowKey = row.join('|');
                if (!fileRows.has(rowKey)) {
                  fileRows.add(rowKey);
                  rowCounts.set(rowKey, (rowCounts.get(rowKey) || 0) + 1);
                }
              });
            });
            
            const intersectRows = Array.from(rowCounts.entries())
              .filter(([rowKey, count]) => rowKey && count === files.length)
              .map(([rowKey]) => rowKey.split('|'));
            
            consolidatedData = intersectRows;
          }
          break;
        }
      }
    }
    
    stats.totalRows = consolidatedData.length;
    
    // Step 3: Remove duplicates if requested (and not already done)
    if (options.removeDuplicates && options.method !== 'union') {
      const beforeCount = consolidatedData.length;
      const seen = new Set<string>();
      consolidatedData = consolidatedData.filter(row => {
        const key = row.join('|');
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
      stats.duplicatesRemoved = beforeCount - consolidatedData.length;
    }
    
    // Step 4: Filter empty rows if requested
    if (options.filterEmpty) {
      const beforeCount = consolidatedData.length;
      consolidatedData = consolidatedData.filter(row => 
        row.some(cell => cell.trim() !== '')
      );
      stats.emptyRowsRemoved = beforeCount - consolidatedData.length;
    }
    
    // Step 5: Sort if requested
    if (options.sortBy && finalHeaders.includes(options.sortBy)) {
      const sortIndex = finalHeaders.indexOf(options.sortBy);
      consolidatedData.sort((a, b) => {
        const aVal = a[sortIndex] || '';
        const bVal = b[sortIndex] || '';
        
        // Try numeric comparison first
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return options.sortOrder === 'desc' ? bNum - aNum : aNum - bNum;
        }
        
        // Fall back to string comparison
        const comparison = aVal.localeCompare(bVal);
        return options.sortOrder === 'desc' ? -comparison : comparison;
      });
    }
    
    stats.processingTime = performance.now() - startTime;
    
    return {
      headers: finalHeaders,
      data: consolidatedData,
      stats
    };
  }

  private static alignDataToDataPoints(
    file: CSVFile, 
    selectedDataPoints: string[], 
    mapping: DataPointMapping
  ): string[][] {
    return file.data.map(row => {
      return selectedDataPoints.map(dataPoint => {
        const mappedHeader = mapping[dataPoint];
        if (mappedHeader) {
          const index = file.headers.indexOf(mappedHeader);
          return index >= 0 ? (row[index] || '') : '';
        }
        return '';
      });
    });
  }
  
  private static alignDataToHeaders(file: CSVFile, targetHeaders: string[]): string[][] {
    return file.data.map(row => {
      return targetHeaders.map(header => {
        const index = file.headers.indexOf(header);
        return index >= 0 ? (row[index] || '') : '';
      });
    });
  }
  
  static exportToCSV(headers: string[], data: string[][], filename?: string): void {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        row.map(cell => {
          // Escape cells that contain commas, quotes, or newlines
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename || `consolidated-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  static validateFiles(files: File[]): { valid: File[], invalid: { file: File, reason: string }[] } {
    const valid: File[] = [];
    const invalid: { file: File, reason: string }[] = [];
    
    files.forEach(file => {
      // Check file type
      if (!file.type.includes('csv') && !file.name.toLowerCase().endsWith('.csv')) {
        invalid.push({ file, reason: 'Not a CSV file' });
        return;
      }
      
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        invalid.push({ file, reason: 'File too large (max 50MB)' });
        return;
      }
      
      // Check if file is empty
      if (file.size === 0) {
        invalid.push({ file, reason: 'File is empty' });
        return;
      }
      
      valid.push(file);
    });
    
    return { valid, invalid };
  }
  
  static getFilePreview(file: CSVFile, maxRows: number = 5): { headers: string[], data: string[][] } {
    return {
      headers: file.headers,
      data: file.data.slice(0, maxRows)
    };
  }
  
  static getDataStats(data: string[][]): {
    totalCells: number;
    emptyCells: number;
    fillRate: number;
    averageRowLength: number;
  } {
    const totalCells = data.reduce((sum, row) => sum + row.length, 0);
    const emptyCells = data.reduce((sum, row) => 
      sum + row.filter(cell => !cell.trim()).length, 0
    );
    
    return {
      totalCells,
      emptyCells,
      fillRate: totalCells > 0 ? ((totalCells - emptyCells) / totalCells) * 100 : 0,
      averageRowLength: data.length > 0 ? totalCells / data.length : 0
    };
  }
}