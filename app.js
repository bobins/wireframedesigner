// Application Data - Updated to remove Module template (4 templates remaining)
const appData = {
  sectionTemplates: [
    {
      "id": "home", 
      "name": "Home", 
      "icon": "🏠", 
      "type": "section", 
      "allowsContent": true,
      "preloadedContent": [
        {"name": "Unit Outline", "type": "resource", "icon": "📋"},
        {"name": "Announcements", "type": "resource", "icon": "📢"}
      ]
    },
    {
      "id": "assessments", 
      "name": "Assessments", 
      "icon": "📝", 
      "type": "section", 
      "allowsContent": true,
      "preloadedContent": [
        {"name": "Assignment", "type": "activity", "icon": "📝"},
        {"name": "Peer Assessment", "type": "activity", "icon": "👨‍🏫"}
      ]
    },
    {
      "id": "topic", 
      "name": "Topic", 
      "icon": "📖", 
      "type": "section", 
      "allowsContent": true,
      "preloadedContent": []
    },
    {
      "id": "what-is-on-this-week", 
      "name": "What is on this week", 
      "icon": "📅", 
      "type": "section", 
      "allowsContent": false,
      "preloadedContent": []
    }
  ],
  resources: [
    {"id": "unit-outline", "name": "Unit Outline", "icon": "📋", "type": "resource"},
    {"id": "read", "name": "Read", "icon": "📄", "type": "resource"},
    {"id": "watch", "name": "Watch", "icon": "🎥", "type": "resource"},
    {"id": "listen", "name": "Listen", "icon": "🎧", "type": "resource"},
    {"id": "external-link", "name": "External Link", "icon": "🔗", "type": "resource"},
    {"id": "folder", "name": "Folder", "icon": "📁", "type": "resource"}
  ],
  activities: [
    {"id": "forum", "name": "Forum", "icon": "💬", "type": "activity"},
    {"id": "quiz", "name": "Quiz", "icon": "❓", "type": "activity"},
    {"id": "assignment", "name": "Assignment", "icon": "📝", "type": "activity"},
    {"id": "poll", "name": "Poll", "icon": "📊", "type": "activity"},
    {"id": "group-selection", "name": "Group Selection", "icon": "👥", "type": "activity"},
    {"id": "checklist", "name": "Checklist", "icon": "✅", "type": "activity"},
    {"id": "database", "name": "Database", "icon": "🗃️", "type": "activity"},
    {"id": "glossary", "name": "Glossary", "icon": "📚", "type": "activity"},
    {"id": "peer-assessment", "name": "Peer Assessment", "icon": "👨‍🏫", "type": "activity"},
    {"id": "board", "name": "Board", "icon": "📌", "type": "activity"}
  ],
  designElements: [
    {"id": "pre-class", "name": "Pre-Class", "icon": "📝", "type": "design-element"},
    {"id": "in-class", "name": "In-Class", "icon": "🏫", "type": "design-element"},
    {"id": "post-class", "name": "Post-Class", "icon": "📚", "type": "design-element"},
    {"id": "practical", "name": "Practical", "icon": "🔧", "type": "design-element"}
  ],
  hierarchyRules: {
    "section": ["subsection", "resource", "activity", "design-element"],
    "section-special": [],
    "subsection": ["resource", "activity", "design-element"],
    "resource": [],
    "activity": [],
    "design-element": []
  },
  propertyFields: {
    "section": ["name", "summaryForStudents", "notesForDeveloper"],
    "subsection": ["name", "summaryForStudents", "notesForDeveloper"],
    "resource": ["name", "description", "approxLearningTime"],
    "activity": ["name", "description", "approxLearningTime"],
    "design-element": ["name"]
  }
};

// Application State
let canvasData = {
  sections: [],
  customCounter: 0
};

let draggedElement = null;
let selectedElement = null;
let contextMenuTarget = null;
let dropZoneIndicator = null;
let dragOverElement = null;
let pendingConfirmAction = null;
let insertionIndex = -1;
let dropIndicators = [];

// DOM Elements
const sectionTemplatesListEl = document.getElementById('section-templates-list');
const resourcesListEl = document.getElementById('resources-list');
const activitiesListEl = document.getElementById('activities-list');
const designElementsListEl = document.getElementById('design-elements-list');
const canvasEl = document.getElementById('canvas');
const canvasPlaceholder = document.getElementById('canvas-placeholder');
const dragPreview = document.getElementById('drag-preview');
const contextMenu = document.getElementById('context-menu');
const propertiesPanel = document.getElementById('properties-panel');
const propertiesContent = document.getElementById('properties-content');
const helpModal = document.getElementById('help-modal');
const confirmModal = document.getElementById('confirm-modal');

// Global function to delete items with confirmation (FIXED)
window.deleteItem = function(element) {
  const elementName = element.querySelector('.section-name, .subsection-name, .content-name')?.textContent || 'this element';
  
  // Show confirmation dialog
  showConfirmationDialog(`Are you sure you want to delete "${elementName}"? This action cannot be undone.`, function() {
    const elementId = element.dataset.id;
    
    if (element.classList.contains('canvas-section')) {
      // Remove from canvas data
      canvasData.sections = canvasData.sections.filter(s => s.id !== elementId);
    } else {
      // Remove from parent content array
      removeFromParentContent(element);
    }
    
    // Clear selection if this element was selected
    if (selectedElement === element) {
      clearSelection();
    }
    
    // Remove from DOM
    element.remove();
    
    // Save changes
    saveCanvasData();
    
    // Show placeholder if canvas is empty
    if (canvasEl.children.length === 1) { // Only placeholder remains
      canvasPlaceholder.style.display = 'flex';
    }
  });
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeComponentLibrary();
  initializeEventListeners();
  loadCanvasData();
  dropZoneIndicator = document.getElementById('drop-zone-indicator');
  
  // Auto-open Starter Guide on first visit
  setTimeout(() => {
    showHelpModal();
  }, 500);
});

// Initialize Component Library
function initializeComponentLibrary() {
  // Populate section templates
  appData.sectionTemplates.forEach(section => {
    const sectionEl = createComponentItem(section);
    sectionTemplatesListEl.appendChild(sectionEl);
  });

  // Populate resources
  appData.resources.forEach(resource => {
    const resourceEl = createComponentItem(resource);
    resourcesListEl.appendChild(resourceEl);
  });

  // Populate activities
  appData.activities.forEach(activity => {
    const activityEl = createComponentItem(activity);
    activitiesListEl.appendChild(activityEl);
  });

  // Populate design elements
  appData.designElements.forEach(element => {
    const elementEl = createComponentItem(element);
    designElementsListEl.appendChild(elementEl);
  });
}

// Create Component Item Element
function createComponentItem(item) {
  const div = document.createElement('div');
  div.className = 'component-item';
  div.draggable = true;
  div.dataset.type = item.type;
  div.dataset.id = item.id;
  div.dataset.name = item.name;
  div.dataset.icon = item.icon;
  div.dataset.allowsContent = item.allowsContent !== undefined ? item.allowsContent : true;

  div.innerHTML = `
    <span class="component-icon">${item.icon}</span>
    <span class="component-name">${item.name}</span>
  `;

  return div;
}

// Initialize Event Listeners
function initializeEventListeners() {
  // Drag and Drop Events
  document.addEventListener('dragstart', handleDragStart);
  document.addEventListener('dragover', handleDragOver);
  document.addEventListener('drop', handleDrop);
  document.addEventListener('dragend', handleDragEnd);

  // Toolbar Events
  document.getElementById('help-btn').addEventListener('click', showHelpModal);
  document.getElementById('save-btn').addEventListener('click', saveCanvas);
  document.getElementById('clear-btn').addEventListener('click', showClearConfirmation);
  document.getElementById('export-btn').addEventListener('click', exportCanvasToPDF);
  document.getElementById('export-png-btn').addEventListener('click', exportToPNG);

  // Custom Element Creation
  document.getElementById('add-section-btn').addEventListener('click', addCustomSection);
  document.getElementById('add-resource-btn').addEventListener('click', addCustomResource);
  document.getElementById('add-activity-btn').addEventListener('click', addCustomActivity);

  // Context Menu Events
  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('click', hideContextMenu);
  document.getElementById('delete-item').addEventListener('click', deleteSelectedItem);

  // Help Modal Events
  document.getElementById('help-modal-close').addEventListener('click', hideHelpModal);
  document.getElementById('help-close-btn').addEventListener('click', hideHelpModal);

  // Confirmation Modal Events (FIXED)
  document.getElementById('confirm-modal-close').addEventListener('click', hideConfirmModal);
  document.getElementById('confirm-cancel').addEventListener('click', hideConfirmModal);
  document.getElementById('confirm-proceed').addEventListener('click', function() {
    proceedWithConfirmedAction();
  });

  // Click outside modals to close
  helpModal.addEventListener('click', function(e) {
    if (e.target === helpModal) {
      hideHelpModal();
    }
  });

  confirmModal.addEventListener('click', function(e) {
    if (e.target === confirmModal) {
      hideConfirmModal();
    }
  });

  // Canvas click events for selection
  document.addEventListener('click', function(e) {
    // Check if click is on a canvas item
    const target = e.target.closest('.canvas-section, .canvas-subsection, .content-item');
    if (target) {
      e.stopPropagation();
      selectElement(target);
    } else if (!e.target.closest('.properties-panel, .context-menu, .modal, .control-btn')) {
      clearSelection();
    }
  });
}

// Export to PNG Function
function exportToPNG() {
  if (canvasData.sections.length === 0) {
    alert('Please add some content to export.');
    return;
  }

  const exportBtn = document.getElementById('export-png-btn');
  const originalText = exportBtn.innerHTML;
  exportBtn.innerHTML = '📷 Exporting...';
  exportBtn.disabled = true;

  // Configure html2canvas options
  const options = {
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim(),
    scale: 2, // Higher quality
    useCORS: true,
    allowTaint: true,
    scrollX: 0,
    scrollY: 0,
    width: canvasEl.scrollWidth,
    height: canvasEl.scrollHeight
  };

  html2canvas(canvasEl, options).then(canvas => {
    // Create download link
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `lms-wireframe-${timestamp}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Reset button
    exportBtn.innerHTML = '✅ Exported!';
    setTimeout(() => {
      exportBtn.innerHTML = originalText;
      exportBtn.disabled = false;
    }, 2000);
  }).catch(error => {
    console.error('Error generating PNG:', error);
    alert('Error generating PNG. Please try again.');
    
    // Reset button
    exportBtn.innerHTML = originalText;
    exportBtn.disabled = false;
  });
}

// Drag and Drop Handlers
function handleDragStart(e) {
  if (!e.target.classList.contains('component-item') && 
      !e.target.classList.contains('canvas-section') && 
      !e.target.classList.contains('canvas-subsection') &&
      !e.target.classList.contains('content-item')) {
    return;
  }

  draggedElement = e.target;
  e.target.classList.add('dragging');

  // Create drag preview
  const name = e.target.dataset.name || 
                e.target.querySelector('.section-name, .subsection-name, .content-name')?.textContent || 
                'Unknown Item';
  
  dragPreview.textContent = name;
  dragPreview.classList.remove('hidden');
  dragPreview.style.left = e.clientX + 10 + 'px';
  dragPreview.style.top = e.clientY + 10 + 'px';

  // Set drag data
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', '');
}

function handleDragOver(e) {
  e.preventDefault();

  // Update drag preview position
  if (!dragPreview.classList.contains('hidden')) {
    dragPreview.style.left = e.clientX + 10 + 'px';
    dragPreview.style.top = e.clientY + 10 + 'px';
  }

  if (!draggedElement) return;

  const draggedType = getDraggedElementType();
  const result = findDropTarget(e.target, e.clientY, draggedType);
  
  // Clear all drag-over states and indicators
  clearDropStates();

  if (result && result.target && canAcceptDrop(draggedType, result.target)) {
    result.target.classList.add('drag-over');
    
    // Show insertion indicators for content reordering
    if (result.insertionPoint !== undefined) {
      showInsertionIndicator(result.target, result.insertionPoint);
      insertionIndex = result.insertionPoint;
    } else {
      insertionIndex = -1;
    }
    
    e.dataTransfer.dropEffect = 'move';
    showDropZoneIndicator(e.clientX, e.clientY, true);
    dragOverElement = result.target;
  } else {
    e.dataTransfer.dropEffect = 'none';
    showDropZoneIndicator(e.clientX, e.clientY, false);
    dragOverElement = null;
    insertionIndex = -1;
  }
}

function handleDrop(e) {
  e.preventDefault();
  
  if (!draggedElement || !dragOverElement) {
    hideDropZoneIndicator();
    clearDropStates();
    return;
  }

  // Hide placeholder if it exists
  if (canvasPlaceholder) {
    canvasPlaceholder.style.display = 'none';
  }

  // Handle different drop scenarios
  if (draggedElement.classList.contains('component-item')) {
    handleComponentDrop(draggedElement, dragOverElement, insertionIndex);
  } else {
    handleExistingElementMove(draggedElement, dragOverElement, insertionIndex);
  }

  hideDropZoneIndicator();
  clearDropStates();
  dragOverElement = null;
  insertionIndex = -1;
}

function handleDragEnd(e) {
  if (e.target.classList.contains('dragging')) {
    e.target.classList.remove('dragging');
  }
  
  draggedElement = null;
  dragOverElement = null;
  insertionIndex = -1;
  dragPreview.classList.add('hidden');
  hideDropZoneIndicator();
  clearDropStates();
}

// Enhanced drop target detection with insertion point calculation
function findDropTarget(target, clientY, draggedType) {
  // Find the closest valid container
  const containers = getValidContainers(draggedType);
  
  for (const containerType of containers) {
    let container = null;
    
    if (containerType === 'canvas') {
      container = target.closest('.canvas');
    } else if (containerType === 'section-content') {
      container = target.closest('.section-content');
    } else if (containerType === 'subsection-content') {
      container = target.closest('.subsection-content');
    }
    
    if (container) {
      // For content containers, calculate insertion point
      if (container.classList.contains('section-content') || container.classList.contains('subsection-content')) {
        const children = Array.from(container.children).filter(child => 
          child.classList.contains('content-item') || child.classList.contains('canvas-subsection')
        );
        
        // Filter out the dragged element if it's in the same container
        const relevantChildren = children.filter(child => child !== draggedElement);
        
        if (relevantChildren.length === 0) {
          return { target: container, insertionPoint: 0 };
        }
        
        // Find insertion point based on mouse position
        let insertionPoint = relevantChildren.length;
        for (let i = 0; i < relevantChildren.length; i++) {
          const rect = relevantChildren[i].getBoundingClientRect();
          const middle = rect.top + rect.height / 2;
          
          if (clientY < middle) {
            insertionPoint = i;
            break;
          }
        }
        
        return { target: container, insertionPoint };
      }
      
      return { target: container };
    }
  }
  
  return null;
}

// Show visual insertion indicator
function showInsertionIndicator(container, insertionPoint) {
  const children = Array.from(container.children).filter(child => 
    (child.classList.contains('content-item') || child.classList.contains('canvas-subsection')) &&
    child !== draggedElement
  );
  
  const indicator = document.createElement('div');
  indicator.className = 'drop-indicator active';
  dropIndicators.push(indicator);
  
  if (insertionPoint === 0) {
    container.insertBefore(indicator, children[0] || null);
  } else if (insertionPoint >= children.length) {
    container.appendChild(indicator);
  } else {
    container.insertBefore(indicator, children[insertionPoint]);
  }
}

// Clear all drop states and indicators
function clearDropStates() {
  document.querySelectorAll('.drag-over, .invalid-drop').forEach(el => {
    el.classList.remove('drag-over', 'invalid-drop');
  });
  
  dropIndicators.forEach(indicator => {
    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  });
  dropIndicators = [];
}

// Helper Functions for Drag and Drop
function getDraggedElementType() {
  if (!draggedElement) return null;
  
  if (draggedElement.classList.contains('component-item')) {
    return draggedElement.dataset.type;
  } else if (draggedElement.classList.contains('canvas-section')) {
    return 'section';
  } else if (draggedElement.classList.contains('canvas-subsection')) {
    return 'subsection';
  } else if (draggedElement.classList.contains('content-item')) {
    return draggedElement.dataset.type;
  }
  
  return null;
}

function getValidContainers(itemType) {
  switch (itemType) {
    case 'section':
      return ['canvas'];
    case 'subsection':
    case 'resource':
    case 'activity':
    case 'design-element':
      return ['section-content', 'subsection-content'];
    default:
      return [];
  }
}

// Improved drop target detection
function canAcceptDrop(draggedType, dropTarget) {
  // Check if the section allows content (for "What is on this week" sections)
  if (dropTarget.classList.contains('section-content')) {
    const section = dropTarget.closest('.canvas-section');
    if (section && section.classList.contains('special-section')) {
      return false; // Special sections don't allow content
    }
    
    // Check if the dragged type is allowed in sections
    return appData.hierarchyRules.section.includes(draggedType);
  }
  
  // Check for subsection content
  if (dropTarget.classList.contains('subsection-content')) {
    // Subsections can accept resources, activities, and design elements
    return appData.hierarchyRules.subsection.includes(draggedType);
  }
  
  // Canvas can accept sections
  if (dropTarget.classList.contains('canvas')) {
    return draggedType === 'section';
  }
  
  return false;
}

function showDropZoneIndicator(x, y, isValid) {
  if (!dropZoneIndicator) return;
  
  dropZoneIndicator.style.left = x + 15 + 'px';
  dropZoneIndicator.style.top = y - 30 + 'px';
  dropZoneIndicator.classList.remove('hidden');
  
  const content = dropZoneIndicator.querySelector('.drop-zone-content');
  if (isValid) {
    dropZoneIndicator.style.backgroundColor = 'var(--color-success)';
    content.innerHTML = '<span class="drop-zone-icon">✅</span><span class="drop-zone-text">Drop here</span>';
  } else {
    dropZoneIndicator.style.backgroundColor = 'var(--color-error)';
    content.innerHTML = '<span class="drop-zone-icon">❌</span><span class="drop-zone-text">Invalid drop</span>';
  }
}

function hideDropZoneIndicator() {
  if (dropZoneIndicator) {
    dropZoneIndicator.classList.add('hidden');
  }
}

// Handle Component Drop with Preloaded Content
function handleComponentDrop(componentEl, dropTarget, insertionIndex = -1) {
  const templateData = appData.sectionTemplates.find(t => t.id === componentEl.dataset.id);
  
  const itemData = {
    id: generateId(),
    name: componentEl.dataset.name,
    icon: componentEl.dataset.icon,
    type: componentEl.dataset.type,
    originalId: componentEl.dataset.id,
    allowsContent: componentEl.dataset.allowsContent === 'true',
    preloadedContent: templateData?.preloadedContent || []
  };

  if (dropTarget.classList.contains('canvas')) {
    if (itemData.type === 'section') {
      createCanvasSection(itemData);
    }
  } else if (dropTarget.classList.contains('section-content')) {
    const sectionEl = dropTarget.closest('.canvas-section');
    createContentInSection(itemData, sectionEl, insertionIndex);
  } else if (dropTarget.classList.contains('subsection-content')) {
    const subsectionEl = dropTarget.closest('.canvas-subsection');
    createContentInSubsection(itemData, subsectionEl, insertionIndex);
  }
}

// Canvas Management with Preloaded Content Support
function createCanvasSection(itemData) {
  const sectionEl = document.createElement('div');
  sectionEl.className = `canvas-section ${!itemData.allowsContent ? 'special-section' : ''}`;
  sectionEl.dataset.id = itemData.id;
  sectionEl.dataset.type = 'section';
  sectionEl.draggable = true;

  sectionEl.innerHTML = `
    <div class="section-header">
      <div class="section-title" data-name="${itemData.name}">
        <span class="component-icon">${itemData.icon}</span>
        <span class="section-name">${itemData.name}</span>
      </div>
      <div class="section-controls">
        <button class="control-btn" onclick="deleteItem(this.closest('.canvas-section'))" title="Delete">🗑️</button>
      </div>
    </div>
    <div class="section-content empty"></div>
  `;

  canvasEl.appendChild(sectionEl);
  
  // Add to canvas data
  const sectionData = {
    id: itemData.id,
    name: itemData.name,
    icon: itemData.icon,
    type: 'section',
    allowsContent: itemData.allowsContent,
    summaryForStudents: '',
    notesForDeveloper: '',
    content: []
  };
  
  canvasData.sections.push(sectionData);
  
  // Add preloaded content
  if (itemData.preloadedContent && itemData.preloadedContent.length > 0) {
    const sectionContent = sectionEl.querySelector('.section-content');
    
    itemData.preloadedContent.forEach(preloadedItem => {
      const contentData = {
        id: generateId(),
        name: preloadedItem.name,
        icon: preloadedItem.icon,
        type: preloadedItem.type,
        ...createContentData({...preloadedItem, id: generateId()})
      };
      
      if (preloadedItem.type === 'subsection') {
        const subsectionEl = createSubsectionElement(contentData);
        sectionContent.appendChild(subsectionEl);
      } else {
        const contentEl = createContentElement(contentData);
        sectionContent.appendChild(contentEl);
      }
      
      sectionData.content.push(contentData);
    });
    
    sectionContent.classList.remove('empty');
  }

  saveCanvasData();
}

function createContentInSection(itemData, sectionEl, insertionIndex = -1) {
  const sectionContent = sectionEl.querySelector('.section-content');
  
  let contentEl;
  if (itemData.type === 'subsection') {
    contentEl = createSubsectionElement(itemData);
  } else {
    contentEl = createContentElement(itemData);
  }
  
  // Insert at specific position if provided
  if (insertionIndex >= 0) {
    const children = Array.from(sectionContent.children).filter(child => 
      child.classList.contains('content-item') || child.classList.contains('canvas-subsection')
    );
    
    if (insertionIndex >= children.length) {
      sectionContent.appendChild(contentEl);
    } else {
      sectionContent.insertBefore(contentEl, children[insertionIndex]);
    }
  } else {
    sectionContent.appendChild(contentEl);
  }
  
  sectionContent.classList.remove('empty');
  
  // Add to canvas data
  const sectionId = sectionEl.dataset.id;
  const section = canvasData.sections.find(s => s.id === sectionId);
  if (section) {
    const contentData = createContentData(itemData);
    
    if (insertionIndex >= 0 && insertionIndex < section.content.length) {
      section.content.splice(insertionIndex, 0, contentData);
    } else {
      section.content.push(contentData);
    }
  }
  
  saveCanvasData();
}

function createContentInSubsection(itemData, subsectionEl, insertionIndex = -1) {
  const subsectionContent = subsectionEl.querySelector('.subsection-content');
  const contentEl = createContentElement(itemData);
  
  // Insert at specific position if provided
  if (insertionIndex >= 0) {
    const children = Array.from(subsectionContent.children).filter(child => 
      child.classList.contains('content-item')
    );
    
    if (insertionIndex >= children.length) {
      subsectionContent.appendChild(contentEl);
    } else {
      subsectionContent.insertBefore(contentEl, children[insertionIndex]);
    }
  } else {
    subsectionContent.appendChild(contentEl);
  }
  
  subsectionContent.classList.remove('empty');
  
  // Add to canvas data
  const subsectionId = subsectionEl.dataset.id;
  const sectionEl = subsectionEl.closest('.canvas-section');
  const sectionId = sectionEl.dataset.id;
  const section = canvasData.sections.find(s => s.id === sectionId);
  const subsection = section?.content?.find(item => item.id === subsectionId);
  
  if (subsection) {
    const contentData = createContentData(itemData);
    
    if (!subsection.content) {
      subsection.content = [];
    }
    
    if (insertionIndex >= 0 && insertionIndex < subsection.content.length) {
      subsection.content.splice(insertionIndex, 0, contentData);
    } else {
      subsection.content.push(contentData);
    }
  }
  
  saveCanvasData();
}

function createSubsectionElement(itemData) {
  const subsectionEl = document.createElement('div');
  subsectionEl.className = 'canvas-subsection';
  subsectionEl.dataset.id = itemData.id;
  subsectionEl.dataset.type = 'subsection';
  subsectionEl.draggable = true;

  subsectionEl.innerHTML = `
    <div class="subsection-header">
      <div class="subsection-title" data-name="${itemData.name}">
        <span class="component-icon">📋</span>
        <span class="subsection-name">${itemData.name}</span>
      </div>
      <div class="subsection-controls">
        <button class="control-btn" onclick="deleteItem(this.closest('.canvas-subsection'))" title="Delete">🗑️</button>
      </div>
    </div>
    <div class="subsection-content empty"></div>
  `;

  return subsectionEl;
}

function createContentElement(itemData) {
  const contentEl = document.createElement('div');
  contentEl.className = 'content-item';
  contentEl.dataset.id = itemData.id;
  contentEl.dataset.type = itemData.type;
  contentEl.draggable = true;

  contentEl.innerHTML = `
    <div class="content-title" data-name="${itemData.name}">
      <span class="component-icon">${itemData.icon}</span>
      <span class="content-name">${itemData.name}</span>
    </div>
    <div class="section-controls">
      <button class="control-btn" onclick="deleteItem(this.closest('.content-item'))" title="Delete">🗑️</button>
    </div>
  `;

  return contentEl;
}

function createContentData(itemData) {
  const baseData = {
    id: itemData.id,
    name: itemData.name,
    icon: itemData.icon,
    type: itemData.type
  };
  
  if (itemData.type === 'subsection') {
    return {
      ...baseData,
      summaryForStudents: '',
      notesForDeveloper: '',
      content: []
    };
  } else if (itemData.type === 'resource' || itemData.type === 'activity') {
    return {
      ...baseData,
      description: '',
      approxLearningTime: ''
    };
  } else {
    return baseData;
  }
}

// Improved existing element move with insertion index support
function handleExistingElementMove(element, dropTarget, insertionIndex = -1) {
  // Get element data before removing
  const itemData = getElementDataById(element.dataset.id, element.dataset.type);
  if (!itemData) return;
  
  // Remove from current parent data
  removeFromParentContent(element);
  
  // Remove from current DOM position
  const oldParent = element.parentElement;
  element.remove();
  
  // Add to new parent at specific position
  dropTarget.classList.remove('empty');
  
  if (insertionIndex >= 0) {
    const children = Array.from(dropTarget.children).filter(child => 
      child.classList.contains('content-item') || child.classList.contains('canvas-subsection')
    );
    
    if (insertionIndex >= children.length) {
      dropTarget.appendChild(element);
    } else {
      dropTarget.insertBefore(element, children[insertionIndex]);
    }
  } else {
    dropTarget.appendChild(element);
  }
  
  // Update data structure
  if (dropTarget.classList.contains('section-content')) {
    const sectionEl = dropTarget.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    
    if (section) {
      if (insertionIndex >= 0 && insertionIndex < section.content.length) {
        section.content.splice(insertionIndex, 0, itemData);
      } else {
        section.content.push(itemData);
      }
    }
  } else if (dropTarget.classList.contains('subsection-content')) {
    const subsectionEl = dropTarget.closest('.canvas-subsection');
    const subsectionId = subsectionEl.dataset.id;
    const sectionEl = subsectionEl.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    const subsection = section?.content?.find(item => item.id === subsectionId);
    
    if (subsection) {
      if (!subsection.content) {
        subsection.content = [];
      }
      
      if (insertionIndex >= 0 && insertionIndex < subsection.content.length) {
        subsection.content.splice(insertionIndex, 0, itemData);
      } else {
        subsection.content.push(itemData);
      }
    }
  }
  
  // Check if old parent is now empty
  if (oldParent) {
    const remainingChildren = Array.from(oldParent.children).filter(child => 
      child.classList.contains('content-item') || child.classList.contains('canvas-subsection')
    );
    if (remainingChildren.length === 0) {
      oldParent.classList.add('empty');
    }
  }
  
  saveCanvasData();
}

// Helper function to get element data by ID and type
function getElementDataById(elementId, elementType) {
  // Search through all sections and their content
  for (const section of canvasData.sections) {
    if (section.id === elementId) {
      return { ...section };
    }
    
    for (const item of section.content || []) {
      if (item.id === elementId) {
        return { ...item };
      }
      
      if (item.type === 'subsection' && item.content) {
        for (const subItem of item.content) {
          if (subItem.id === elementId) {
            return { ...subItem };
          }
        }
      }
    }
  }
  
  return null;
}

function removeFromParentContent(element) {
  const elementId = element.dataset.id;
  const parentContentEl = element.parentElement;
  
  if (parentContentEl.classList.contains('section-content')) {
    // Remove from section content
    const sectionEl = parentContentEl.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    if (section) {
      section.content = section.content.filter(item => item.id !== elementId);
    }
  } else if (parentContentEl.classList.contains('subsection-content')) {
    // Remove from subsection content
    const subsectionEl = parentContentEl.closest('.canvas-subsection');
    const subsectionId = subsectionEl.dataset.id;
    const sectionEl = subsectionEl.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    const subsection = section?.content?.find(item => item.id === subsectionId);
    
    if (subsection && subsection.content) {
      subsection.content = subsection.content.filter(item => item.id !== elementId);
    }
  }
}

// Help Modal Functions
function showHelpModal() {
  helpModal.classList.remove('hidden');
}

function hideHelpModal() {
  helpModal.classList.add('hidden');
}

// Confirmation Modal Functions (FIXED)
function showClearConfirmation() {
  const message = 'Are you sure you want to clear all content? This action cannot be undone.';
  showConfirmationDialog(message, clearCanvas);
}

function showConfirmationDialog(message, action) {
  document.getElementById('confirm-message').textContent = message;
  pendingConfirmAction = action;
  confirmModal.classList.remove('hidden');
}

function hideConfirmModal() {
  confirmModal.classList.add('hidden');
  pendingConfirmAction = null;
}

function proceedWithConfirmedAction() {
  if (pendingConfirmAction) {
    try {
      pendingConfirmAction();
    } catch (error) {
      console.error('Error executing confirmed action:', error);
    }
  }
  hideConfirmModal();
}

// Element Selection with Visual Indicators
function selectElement(element) {
  // Clear previous selection
  document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
  
  // Select current element
  element.classList.add('selected');
  selectedElement = element;
  
  // Update properties panel
  updatePropertiesPanel(element);
}

function clearSelection() {
  document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
  selectedElement = null;
  propertiesContent.innerHTML = '<p class="properties-empty">Select an item to edit its properties.</p>';
}

// Properties Panel Management with Save Changes Button
function updatePropertiesPanel(element) {
  const elementType = getElementTypeFromDOM(element);
  const elementData = getElementData(element);
  const fields = appData.propertyFields[elementType] || [];
  
  let html = '<form class="properties-form">';
  
  fields.forEach(field => {
    const label = formatFieldLabel(field);
    const value = elementData[field] || '';
    
    if (field === 'description' || field === 'summaryForStudents' || field === 'notesForDeveloper') {
      html += `
        <div class="form-group">
          <label class="form-label" for="prop-${field}">${label}</label>
          <textarea class="form-control" id="prop-${field}" placeholder="Enter ${label.toLowerCase()}">${value}</textarea>
        </div>
      `;
    } else {
      html += `
        <div class="form-group">
          <label class="form-label" for="prop-${field}">${label}</label>
          <input type="text" class="form-control" id="prop-${field}" placeholder="Enter ${label.toLowerCase()}" value="${value}">
        </div>
      `;
    }
  });
  
  html += `
    <div class="properties-save">
      <button type="button" class="btn btn--primary btn--sm" id="save-changes-btn">💾 Save Changes</button>
    </div>
  </form>`;
  
  propertiesContent.innerHTML = html;
  
  // Add save changes event listener
  document.getElementById('save-changes-btn').addEventListener('click', function() {
    saveElementChanges(element);
  });
}

function saveElementChanges(element) {
  const form = propertiesContent.querySelector('.properties-form');
  if (!form) return;

  // Get all form fields and update element data
  const inputs = form.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    const fieldName = input.id.replace('prop-', '');
    const fieldValue = input.value;
    updateElementData(element, fieldName, fieldValue);
  });

  // Visual feedback for successful save
  const saveBtn = document.getElementById('save-changes-btn');
  const originalText = saveBtn.innerHTML;
  saveBtn.innerHTML = '✅ Saved!';
  saveBtn.classList.add('save-success');
  
  // Re-select the element to maintain context and update properties panel
  setTimeout(() => {
    saveBtn.innerHTML = originalText;
    saveBtn.classList.remove('save-success');
    
    // Re-update properties panel to reflect changes
    updatePropertiesPanel(element);
  }, 1500);

  saveCanvasData();
}

function formatFieldLabel(field) {
  const labels = {
    'name': 'Name',
    'summaryForStudents': 'Summary for Students',
    'notesForDeveloper': 'Notes for Developer',
    'description': 'Description',
    'approxLearningTime': 'Approx. Learning Time'
  };
  return labels[field] || field;
}

function getElementTypeFromDOM(element) {
  if (element.classList.contains('canvas-section')) {
    return 'section';
  } else if (element.classList.contains('canvas-subsection')) {
    return 'subsection';
  } else if (element.classList.contains('content-item')) {
    return element.dataset.type;
  }
  return null;
}

function getElementData(element) {
  const elementId = element.dataset.id;
  
  if (element.classList.contains('canvas-section')) {
    return canvasData.sections.find(s => s.id === elementId) || {};
  } else if (element.classList.contains('canvas-subsection')) {
    const sectionEl = element.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    return section?.content?.find(item => item.id === elementId) || {};
  } else if (element.classList.contains('content-item')) {
    const parentEl = element.parentElement.closest('.canvas-section, .canvas-subsection');
    if (parentEl.classList.contains('canvas-section')) {
      const sectionId = parentEl.dataset.id;
      const section = canvasData.sections.find(s => s.id === sectionId);
      return section?.content?.find(item => item.id === elementId) || {};
    } else {
      const subsectionId = parentEl.dataset.id;
      const sectionEl = parentEl.closest('.canvas-section');
      const sectionId = sectionEl.dataset.id;
      const section = canvasData.sections.find(s => s.id === sectionId);
      const subsection = section?.content?.find(item => item.id === subsectionId);
      return subsection?.content?.find(item => item.id === elementId) || {};
    }
  }
  
  return {};
}

function updateElementData(element, fieldName, fieldValue) {
  const elementId = element.dataset.id;
  
  if (element.classList.contains('canvas-section')) {
    const section = canvasData.sections.find(s => s.id === elementId);
    if (section) {
      section[fieldName] = fieldValue;
      if (fieldName === 'name') {
        const nameEl = element.querySelector('.section-name');
        if (nameEl) nameEl.textContent = fieldValue;
      }
    }
  } else if (element.classList.contains('canvas-subsection')) {
    const sectionEl = element.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    const subsection = section?.content?.find(item => item.id === elementId);
    if (subsection) {
      subsection[fieldName] = fieldValue;
      if (fieldName === 'name') {
        const nameEl = element.querySelector('.subsection-name');
        if (nameEl) nameEl.textContent = fieldValue;
      }
    }
  } else if (element.classList.contains('content-item')) {
    const parentEl = element.parentElement.closest('.canvas-section, .canvas-subsection');
    let targetContent;
    
    if (parentEl.classList.contains('canvas-section')) {
      const sectionId = parentEl.dataset.id;
      const section = canvasData.sections.find(s => s.id === sectionId);
      targetContent = section?.content?.find(item => item.id === elementId);
    } else {
      const subsectionId = parentEl.dataset.id;
      const sectionEl = parentEl.closest('.canvas-section');
      const sectionId = sectionEl.dataset.id;
      const section = canvasData.sections.find(s => s.id === sectionId);
      const subsection = section?.content?.find(item => item.id === subsectionId);
      targetContent = subsection?.content?.find(item => item.id === elementId);
    }
    
    if (targetContent) {
      targetContent[fieldName] = fieldValue;
      if (fieldName === 'name') {
        const nameEl = element.querySelector('.content-name');
        if (nameEl) nameEl.textContent = fieldValue;
      }
    }
  }
}

// Context Menu
function handleContextMenu(e) {
  const target = e.target.closest('.canvas-section, .canvas-subsection, .content-item');
  if (target) {
    e.preventDefault();
    contextMenuTarget = target;
    
    contextMenu.style.left = e.clientX + 'px';
    contextMenu.style.top = e.clientY + 'px';
    contextMenu.classList.remove('hidden');
  }
}

function hideContextMenu() {
  contextMenu.classList.add('hidden');
  contextMenuTarget = null;
}

function deleteSelectedItem() {
  if (contextMenuTarget) {
    window.deleteItem(contextMenuTarget);
  }
  hideContextMenu();
}

// Toolbar Functions
function saveCanvas() {
  saveCanvasData();
  alert('Canvas saved successfully!');
}

function clearCanvas() {
  canvasData = { sections: [], customCounter: 0 };
  canvasEl.innerHTML = '';
  canvasEl.appendChild(canvasPlaceholder);
  canvasPlaceholder.style.display = 'flex';
  clearSelection();
  saveCanvasData();
}

// Custom Element Creation
function addCustomSection() {
  const name = prompt('Enter section name:');
  if (!name) return;
  
  const itemData = {
    id: generateId(),
    name: name,
    icon: '📁',
    type: 'section',
    allowsContent: true,
    preloadedContent: []
  };
  
  createCanvasSection(itemData);
  canvasPlaceholder.style.display = 'none';
}

function addCustomResource() {
  const sections = document.querySelectorAll('.canvas-section:not(.special-section)');
  if (sections.length === 0) {
    alert('Please create a section first before adding resources.');
    return;
  }
  
  const name = prompt('Enter resource name:');
  if (!name) return;
  
  const itemData = {
    id: generateId(),
    name: name,
    icon: '📄',
    type: 'resource'
  };
  
  // Add to first available section
  createContentInSection(itemData, sections[0]);
}

function addCustomActivity() {
  const sections = document.querySelectorAll('.canvas-section:not(.special-section)');
  if (sections.length === 0) {
    alert('Please create a section first before adding activities.');
    return;
  }
  
  const name = prompt('Enter activity name:');
  if (!name) return;
  
  const itemData = {
    id: generateId(),
    name: name,
    icon: '⚡',
    type: 'activity'
  };
  
  // Add to first available section
  createContentInSection(itemData, sections[0]);
}

// PDF Export Function
function exportCanvasToPDF() {
  if (canvasData.sections.length === 0) {
    alert('Please add some content to export.');
    return;
  }

  document.body.classList.add('exporting');
  
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // PDF Configuration
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = margin;
    
    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('LMS Course Wireframe', margin, yPosition);
    yPosition += 15;
    
    // Date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;
    
    // Process each section
    canvasData.sections.forEach((section, sectionIndex) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
      }
      
      // Section Header
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(`SECTION: ${section.name}`, margin, yPosition);
      yPosition += 8;
      
      // Section properties
      if (section.summaryForStudents) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Summary: ${section.summaryForStudents}`, margin + 5, yPosition);
        yPosition += 6;
      }
      
      if (section.notesForDeveloper) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text(`Developer Notes: ${section.notesForDeveloper}`, margin + 5, yPosition);
        yPosition += 6;
      }
      
      yPosition += 5;
      
      // Section border
      doc.setDrawColor(33, 128, 141);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
      
      // Process section content
      if (section.content && section.content.length > 0) {
        section.content.forEach((item) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = margin;
          }
          
          yPosition = renderContentItem(doc, item, margin + 10, yPosition, pageHeight);
        });
      } else {
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text('  (No content)', margin + 10, yPosition);
        yPosition += 8;
      }
      
      yPosition += 15;
    });
    
    // Footer on each page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
      doc.text('Generated by LMS Wireframe Designer', margin, pageHeight - 10);
    }
    
    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `lms-wireframe-${timestamp}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    document.body.classList.remove('exporting');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
    document.body.classList.remove('exporting');
  }
}

function renderContentItem(doc, item, x, y, pageHeight) {
  let yPosition = y;
  
  if (item.type === 'subsection') {
    // Subsection Header
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`SUBSECTION: ${item.name}`, x, yPosition);
    yPosition += 8;
    
    // Subsection properties
    if (item.summaryForStudents) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text(`Summary: ${item.summaryForStudents}`, x + 5, yPosition);
      yPosition += 6;
    }
    
    if (item.notesForDeveloper) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      doc.text(`Developer Notes: ${item.notesForDeveloper}`, x + 5, yPosition);
      yPosition += 6;
    }
    
    yPosition += 5;
    
    // Subsection content
    if (item.content && item.content.length > 0) {
      item.content.forEach((subItem) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        yPosition = renderContentItem(doc, subItem, x + 10, yPosition, pageHeight);
      });
    }
    
  } else if (item.type === 'design-element') {
    // Design Element
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`--- ${item.name.toUpperCase()} ---`, x, yPosition);
    yPosition += 10;
    
  } else {
    // Resource or Activity
    const typeLabel = item.type === 'resource' ? 'RESOURCE' : 'ACTIVITY';
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`${typeLabel}: ${item.name}`, x, yPosition);
    yPosition += 6;
    
    if (item.description) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text(`Description: ${item.description}`, x + 5, yPosition);
      yPosition += 6;
    }
    
    if (item.approxLearningTime) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text(`Learning Time: ${item.approxLearningTime}`, x + 5, yPosition);
      yPosition += 6;
    }
    
    yPosition += 3;
  }
  
  return yPosition;
}

// Utility Functions
function generateId() {
  return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function saveCanvasData() {
  try {
    localStorage.setItem('lms_wireframe_canvas', JSON.stringify(canvasData));
  } catch (e) {
    console.error('Error saving canvas data:', e);
  }
}

function loadCanvasData() {
  const saved = localStorage.getItem('lms_wireframe_canvas');
  if (saved) {
    try {
      canvasData = JSON.parse(saved);
      renderCanvas();
    } catch (e) {
      console.error('Error loading saved data:', e);
      canvasData = { sections: [], customCounter: 0 };
    }
  }
}

function renderCanvas() {
  canvasEl.innerHTML = '';
  
  if (canvasData.sections.length === 0) {
    canvasEl.appendChild(canvasPlaceholder);
    canvasPlaceholder.style.display = 'flex';
    return;
  }
  
  canvasData.sections.forEach(sectionData => {
    const sectionEl = document.createElement('div');
    sectionEl.className = `canvas-section ${!sectionData.allowsContent ? 'special-section' : ''}`;
    sectionEl.dataset.id = sectionData.id;
    sectionEl.dataset.type = 'section';
    sectionEl.draggable = true;

    sectionEl.innerHTML = `
      <div class="section-header">
        <div class="section-title" data-name="${sectionData.name}">
          <span class="component-icon">${sectionData.icon}</span>
          <span class="section-name">${sectionData.name}</span>
        </div>
        <div class="section-controls">
          <button class="control-btn" onclick="deleteItem(this.closest('.canvas-section'))" title="Delete">🗑️</button>
        </div>
      </div>
      <div class="section-content ${!sectionData.content || sectionData.content.length === 0 ? 'empty' : ''}"></div>
    `;

    const sectionContent = sectionEl.querySelector('.section-content');
    
    if (sectionData.content && sectionData.content.length > 0) {
      sectionData.content.forEach(contentData => {
        let contentEl;
        
        if (contentData.type === 'subsection') {
          contentEl = createSubsectionElement(contentData);
          const subsectionContent = contentEl.querySelector('.subsection-content');
          
          if (contentData.content && contentData.content.length > 0) {
            contentData.content.forEach(subContentData => {
              const subContentEl = createContentElement(subContentData);
              subsectionContent.appendChild(subContentEl);
            });
            subsectionContent.classList.remove('empty');
          }
        } else {
          contentEl = createContentElement(contentData);
        }
        
        sectionContent.appendChild(contentEl);
      });
    }

    canvasEl.appendChild(sectionEl);
  });
  
  canvasEl.appendChild(canvasPlaceholder);
  canvasPlaceholder.style.display = 'none';
}