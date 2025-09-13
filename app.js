// Application Data - Fixed for Version 22 without subsections
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
  ]
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
let currentMoveElement = null;
let currentDeleteElement = null;
let insertionIndex = -1;
let currentDropContainer = null;

// DOM Elements
const sectionTemplatesListEl = document.getElementById('section-templates-list');
const resourcesListEl = document.getElementById('resources-list');
const activitiesListEl = document.getElementById('activities-list');
const designElementsListEl = document.getElementById('design-elements-list');
const canvasEl = document.getElementById('canvas');
const canvasPlaceholder = document.getElementById('canvas-placeholder');
const dragPreview = document.getElementById('drag-preview');
const contextMenu = document.getElementById('context-menu');
const editModal = document.getElementById('edit-modal');
const moveModal = document.getElementById('move-modal');
const deleteModal = document.getElementById('delete-modal');
const starterGuideModal = document.getElementById('starter-guide-modal');
const propertiesPanel = document.getElementById('properties-panel');
const propertiesContent = document.getElementById('properties-content');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeComponentLibrary();
  initializeEventListeners();
  loadCanvasData();
  dropZoneIndicator = document.getElementById('drop-zone-indicator');
  
  // Show Starter Guide automatically on page load
  setTimeout(() => {
    showStarterGuide();
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

// FIXED: Initialize Event Listeners with proper event delegation
function initializeEventListeners() {
  // Drag and Drop Events
  document.addEventListener('dragstart', handleDragStart);
  document.addEventListener('dragover', handleDragOver);
  document.addEventListener('drop', handleDrop);
  document.addEventListener('dragend', handleDragEnd);

  // Toolbar Events
  document.getElementById('save-btn').addEventListener('click', saveCanvas);
  document.getElementById('clear-btn').addEventListener('click', clearCanvas);
  document.getElementById('export-btn').addEventListener('click', exportCanvasToPDF);
  document.getElementById('starter-guide-btn').addEventListener('click', showStarterGuide);

  // Custom Element Creation
  document.getElementById('add-section-btn').addEventListener('click', addCustomSection);
  document.getElementById('add-resource-btn').addEventListener('click', addCustomResource);
  document.getElementById('add-activity-btn').addEventListener('click', addCustomActivity);

  // Context Menu Events
  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('click', hideContextMenu);
  document.getElementById('edit-item').addEventListener('click', editSelectedItem);
  document.getElementById('delete-item').addEventListener('click', deleteSelectedItem);

  // Modal Events
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('cancel-edit').addEventListener('click', closeModal);
  document.getElementById('save-edit').addEventListener('click', saveItemEdit);

  // Move Modal Events
  document.getElementById('move-modal-close').addEventListener('click', closeMoveModal);
  document.getElementById('cancel-move').addEventListener('click', closeMoveModal);

  // FIXED: Delete Modal Events
  document.getElementById('delete-modal-close').addEventListener('click', closeDeleteModal);
  document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);
  document.getElementById('confirm-delete').addEventListener('click', confirmDelete);

  // Starter Guide Modal Events
  document.getElementById('starter-guide-close').addEventListener('click', hideStarterGuide);
  document.getElementById('close-starter-guide').addEventListener('click', hideStarterGuide);

  // FIXED: Event delegation for dynamically created elements
  document.addEventListener('click', function(e) {
    // Handle edit buttons
    if (e.target.closest('.control-btn') && e.target.textContent === '✏️') {
      e.preventDefault();
      e.stopPropagation();
      const element = e.target.closest('.canvas-section, .content-item');
      if (element) {
        selectElement(element);
      }
    }
    
    // FIXED: Handle move buttons
    if (e.target.closest('.control-btn') && e.target.textContent === '↕️') {
      e.preventDefault();
      e.stopPropagation();
      const element = e.target.closest('.canvas-section, .content-item');
      if (element) {
        showMoveMenu(element);
      }
    }
    
    // FIXED: Handle delete buttons
    if (e.target.closest('.control-btn') && e.target.textContent === '🗑️') {
      e.preventDefault();
      e.stopPropagation();
      const element = e.target.closest('.canvas-section, .content-item');
      if (element) {
        showDeleteConfirmation(element);
      }
    }
    
    // Handle element selection
    const target = e.target.closest('.canvas-section, .content-item');
    if (target && !e.target.closest('.control-btn')) {
      selectElement(target);
    } else if (!e.target.closest('.properties-panel, .context-menu, .modal')) {
      clearSelection();
    }
  });

  // Click outside modal to close
  editModal.addEventListener('click', function(e) {
    if (e.target === editModal) {
      closeModal();
    }
  });

  moveModal.addEventListener('click', function(e) {
    if (e.target === moveModal) {
      closeMoveModal();
    }
  });

  deleteModal.addEventListener('click', function(e) {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });

  starterGuideModal.addEventListener('click', function(e) {
    if (e.target === starterGuideModal) {
      hideStarterGuide();
    }
  });
}

// Starter Guide Functions
function showStarterGuide() {
  starterGuideModal.classList.remove('hidden');
}

function hideStarterGuide() {
  starterGuideModal.classList.add('hidden');
}

// Element Selection
function selectElement(element) {
  document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
  element.classList.add('selected');
  selectedElement = element;
  updatePropertiesPanel(element);
}

function clearSelection() {
  document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
  selectedElement = null;
  propertiesContent.innerHTML = '<p class="properties-empty">Select an item to edit its properties.</p>';
}

// Properties Panel Management
function updatePropertiesPanel(element) {
  const elementType = getElementType(element);
  const elementData = getElementData(element);
  const fields = getPropertyFields(elementType);
  const currentDisplayName = getCurrentDisplayName(element);
  
  let html = '<form class="properties-form">';
  
  fields.forEach(field => {
    const label = formatFieldLabel(field);
    let value = elementData[field] || '';
    
    if (field === 'name' && !value && currentDisplayName) {
      value = currentDisplayName;
    }
    
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
  
  html += '</form>';
  propertiesContent.innerHTML = html;
  
  // Add event listeners to form fields
  const form = propertiesContent.querySelector('.properties-form');
  if (form) {
    form.addEventListener('input', function(e) {
      const fieldName = e.target.id.replace('prop-', '');
      const fieldValue = e.target.value;
      updateElementData(element, fieldName, fieldValue);
    });
  }
}

function getCurrentDisplayName(element) {
  if (element.classList.contains('canvas-section')) {
    const nameEl = element.querySelector('.section-name');
    return nameEl ? nameEl.textContent : null;
  } else if (element.classList.contains('content-item')) {
    const nameEl = element.querySelector('.content-name');
    return nameEl ? nameEl.textContent : null;
  }
  return null;
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

function getElementType(element) {
  if (element.classList.contains('canvas-section')) {
    return 'section';
  } else if (element.classList.contains('content-item')) {
    return element.dataset.type;
  }
  return null;
}

function getPropertyFields(elementType) {
  const propertyFields = {
    "section": ["name", "summaryForStudents", "notesForDeveloper"],
    "resource": ["name", "description", "approxLearningTime"],
    "activity": ["name", "description", "approxLearningTime"],
    "design-element": ["name"]
  };
  return propertyFields[elementType] || [];
}

function getElementData(element) {
  const elementId = element.dataset.id;
  
  if (element.classList.contains('canvas-section')) {
    return canvasData.sections.find(s => s.id === elementId) || {};
  } else if (element.classList.contains('content-item')) {
    const sectionEl = element.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    return section?.content?.find(item => item.id === elementId) || {};
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
  } else if (element.classList.contains('content-item')) {
    const sectionEl = element.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    const targetContent = section?.content?.find(item => item.id === elementId);
    
    if (targetContent) {
      targetContent[fieldName] = fieldValue;
      if (fieldName === 'name') {
        const nameEl = element.querySelector('.content-name');
        if (nameEl) nameEl.textContent = fieldValue;
      }
    }
  }
  
  saveCanvasData();
}

// FIXED: Drag and Drop Handlers
function handleDragStart(e) {
  if (!e.target.classList.contains('component-item') && 
      !e.target.classList.contains('canvas-section') && 
      !e.target.classList.contains('content-item')) {
    return;
  }

  draggedElement = e.target;
  e.target.classList.add('dragging');

  const name = e.target.dataset.name || 
                e.target.querySelector('.section-name, .content-name')?.textContent || 
                'Unknown Item';
  
  dragPreview.textContent = name;
  dragPreview.classList.remove('hidden');
  dragPreview.style.left = e.clientX + 10 + 'px';
  dragPreview.style.top = e.clientY + 10 + 'px';

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', '');
}

// FIXED: Enhanced handleDragOver
function handleDragOver(e) {
  e.preventDefault();

  if (!dragPreview.classList.contains('hidden')) {
    dragPreview.style.left = e.clientX + 10 + 'px';
    dragPreview.style.top = e.clientY + 10 + 'px';
  }

  if (!draggedElement) return;

  const draggedType = getDraggedElementType();
  const dropTarget = findValidDropTarget(e.target, draggedType);
  
  document.querySelectorAll('.drag-over, .invalid-drop').forEach(el => {
    el.classList.remove('drag-over', 'invalid-drop');
  });
  clearInsertionIndicators();

  if (dropTarget && isValidDrop(draggedType, dropTarget)) {
    dropTarget.classList.add('drag-over');
    currentDropContainer = dropTarget;
    
    if (dropTarget.classList.contains('section-content')) {
      const insertionInfo = calculateInsertionIndex(dropTarget, e.clientY);
      insertionIndex = insertionInfo.index;
      showDropIndicator(dropTarget, insertionInfo.index, insertionInfo.position);
    } else if (dropTarget.classList.contains('canvas')) {
      const insertionInfo = calculateCanvasInsertionIndex(dropTarget, e.clientY);
      insertionIndex = insertionInfo.index;
      showCanvasDropIndicator(dropTarget, insertionInfo.index);
    }
    
    e.dataTransfer.dropEffect = 'move';
    showDropZoneIndicator(e.clientX, e.clientY, true);
    dragOverElement = dropTarget;
  } else {
    e.dataTransfer.dropEffect = 'none';
    showDropZoneIndicator(e.clientX, e.clientY, false);
    dragOverElement = null;
    currentDropContainer = null;
    insertionIndex = -1;
  }
}

// FIXED: Enhanced handleDrop
function handleDrop(e) {
  e.preventDefault();
  
  clearInsertionIndicators();
  
  if (!draggedElement || !dragOverElement) {
    hideDropZoneIndicator();
    return;
  }

  if (canvasPlaceholder) {
    canvasPlaceholder.style.display = 'none';
  }

  if (draggedElement.classList.contains('component-item')) {
    handleComponentDrop(draggedElement, dragOverElement);
  } else {
    handleExistingElementMove(draggedElement, dragOverElement);
  }

  hideDropZoneIndicator();
  dragOverElement = null;
  currentDropContainer = null;
  insertionIndex = -1;
  
  document.querySelectorAll('.drag-over, .invalid-drop').forEach(el => {
    el.classList.remove('drag-over', 'invalid-drop');
  });
}

function handleDragEnd(e) {
  if (e.target.classList.contains('dragging')) {
    e.target.classList.remove('dragging');
  }
  
  clearInsertionIndicators();
  draggedElement = null;
  dragOverElement = null;
  currentDropContainer = null;
  insertionIndex = -1;
  dragPreview.classList.add('hidden');
  hideDropZoneIndicator();
  
  document.querySelectorAll('.drag-over, .invalid-drop').forEach(el => {
    el.classList.remove('drag-over', 'invalid-drop');
  });
}

// Helper Functions for Drag and Drop
function getDraggedElementType() {
  if (!draggedElement) return null;
  
  if (draggedElement.classList.contains('component-item')) {
    return draggedElement.dataset.type;
  } else if (draggedElement.classList.contains('canvas-section')) {
    return 'section';
  } else if (draggedElement.classList.contains('content-item')) {
    return draggedElement.dataset.type;
  }
  
  return null;
}

function findValidDropTarget(target, draggedType) {
  if (!draggedType) return null;

  if (draggedType === 'section') {
    return target.closest('.canvas');
  } else {
    const sectionContent = target.closest('.section-content');
    if (sectionContent) {
      return sectionContent;
    }
  }
  
  return null;
}

function isValidDrop(draggedType, dropTarget) {
  if (dropTarget.classList.contains('section-content')) {
    const section = dropTarget.closest('.canvas-section');
    if (section && section.classList.contains('special-section')) {
      return false;
    }
  }
  
  return true;
}

function calculateInsertionIndex(container, clientY) {
  const children = Array.from(container.children);
  if (children.length === 0) {
    return { index: 0, position: 'start' };
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const rect = child.getBoundingClientRect();
    const midpoint = rect.top + (rect.height / 2);
    
    if (clientY < midpoint) {
      return { index: i, position: 'before' };
    }
  }
  
  return { index: children.length, position: 'after' };
}

function calculateCanvasInsertionIndex(canvas, clientY) {
  const sections = Array.from(canvas.querySelectorAll('.canvas-section'));
  if (sections.length === 0) {
    return { index: 0, position: 'start' };
  }

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const rect = section.getBoundingClientRect();
    const midpoint = rect.top + (rect.height / 2);
    
    if (clientY < midpoint) {
      return { index: i, position: 'before' };
    }
  }
  
  return { index: sections.length, position: 'after' };
}

function showDropIndicator(container, index, position) {
  clearInsertionIndicators();
  
  const indicator = document.createElement('div');
  indicator.className = 'drop-insertion-line active';
  indicator.id = 'insertion-indicator';
  
  const children = Array.from(container.children);
  
  if (position === 'start' || children.length === 0) {
    container.insertBefore(indicator, container.firstChild);
  } else if (position === 'after' || index >= children.length) {
    container.appendChild(indicator);
  } else {
    container.insertBefore(indicator, children[index]);
  }
}

function showCanvasDropIndicator(canvas, index) {
  clearInsertionIndicators();
  
  const indicator = document.createElement('div');
  indicator.className = 'drop-insertion-line active';
  indicator.id = 'canvas-insertion-indicator';
  indicator.style.margin = '10px 0';
  indicator.style.height = '3px';
  
  const sections = Array.from(canvas.querySelectorAll('.canvas-section'));
  
  if (sections.length === 0 || index === 0) {
    canvas.insertBefore(indicator, canvas.firstChild);
  } else if (index >= sections.length) {
    canvas.insertBefore(indicator, canvas.lastElementChild);
  } else {
    canvas.insertBefore(indicator, sections[index]);
  }
}

function clearInsertionIndicators() {
  const indicators = document.querySelectorAll('#insertion-indicator, #canvas-insertion-indicator');
  indicators.forEach(indicator => indicator.remove());
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

// FIXED: Handle Component Drop
function handleComponentDrop(componentEl, dropTarget) {
  const originalTemplate = appData.sectionTemplates.find(t => t.id === componentEl.dataset.id);
  
  const itemData = {
    id: generateId(),
    name: componentEl.dataset.name,
    icon: componentEl.dataset.icon,
    type: componentEl.dataset.type,
    originalId: componentEl.dataset.id,
    allowsContent: componentEl.dataset.allowsContent === 'true',
    preloadedContent: originalTemplate?.preloadedContent || []
  };

  if (dropTarget.classList.contains('canvas')) {
    if (itemData.type === 'section') {
      createCanvasSection(itemData);
    }
  } else if (dropTarget.classList.contains('section-content')) {
    const sectionEl = dropTarget.closest('.canvas-section');
    createContentInSection(itemData, sectionEl);
  }
}

// FIXED: Handle existing element move
function handleExistingElementMove(element, dropTarget) {
  const parentEl = element.parentElement;
  const elementData = getElementData(element);
  
  removeFromParentContent(element);
  element.remove();
  
  if (dropTarget.classList.contains('canvas') && element.classList.contains('canvas-section')) {
    canvasEl.appendChild(element);
    canvasData.sections.push(elementData);
  } else if (dropTarget.classList.contains('section-content')) {
    dropTarget.appendChild(element);
    dropTarget.classList.remove('empty');
    const sectionEl = dropTarget.closest('.canvas-section');
    addToSectionContent(elementData, sectionEl);
  }
  
  if (parentEl && parentEl.children.length === 0 && parentEl.classList.contains('section-content')) {
    parentEl.classList.add('empty');
  }
  
  saveCanvasData();
}

// Canvas Management
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
        <button class="control-btn" data-action="edit">✏️</button>
        <button class="control-btn" data-action="move">↕️</button>
        <button class="control-btn" data-action="delete">🗑️</button>
      </div>
    </div>
    <div class="section-content empty"></div>
  `;

  canvasEl.appendChild(sectionEl);
  
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
  
  if (itemData.preloadedContent && itemData.preloadedContent.length > 0) {
    const sectionContent = sectionEl.querySelector('.section-content');
    itemData.preloadedContent.forEach(preloadedItem => {
      const contentData = {
        id: generateId(),
        name: preloadedItem.name,
        icon: preloadedItem.icon,
        type: preloadedItem.type
      };
      
      const contentEl = createContentElement(contentData);
      sectionContent.appendChild(contentEl);
      sectionData.content.push({
        ...contentData,
        description: '',
        approxLearningTime: ''
      });
    });
    
    if (itemData.preloadedContent.length > 0) {
      sectionContent.classList.remove('empty');
    }
  }

  saveCanvasData();
}

function createContentInSection(itemData, sectionEl) {
  const sectionContent = sectionEl.querySelector('.section-content');
  const contentEl = createContentElement(itemData);
  sectionContent.appendChild(contentEl);
  
  sectionContent.classList.remove('empty');
  
  const sectionId = sectionEl.dataset.id;
  const section = canvasData.sections.find(s => s.id === sectionId);
  if (section) {
    const contentData = createContentData(itemData);
    section.content.push(contentData);
  }
  
  saveCanvasData();
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
      <button class="control-btn" data-action="edit">✏️</button>
      <button class="control-btn" data-action="move">↕️</button>
      <button class="control-btn" data-action="delete">🗑️</button>
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
  
  if (itemData.type === 'resource' || itemData.type === 'activity') {
    return {
      ...baseData,
      description: '',
      approxLearningTime: ''
    };
  } else {
    return baseData;
  }
}

function addToSectionContent(contentData, sectionEl) {
  const sectionId = sectionEl.dataset.id;
  const section = canvasData.sections.find(s => s.id === sectionId);
  if (section) {
    section.content.push(contentData);
  }
}

// FIXED: Move Menu System
function showMoveMenu(element) {
  currentMoveElement = element;
  const elementName = getCurrentDisplayName(element) || 'Unknown Item';
  
  document.getElementById('move-item-name').textContent = elementName;
  buildMoveList();
  moveModal.classList.remove('hidden');
}

function buildMoveList() {
  const moveList = document.getElementById('move-list');
  moveList.innerHTML = '';
  
  if (canvasData.sections.length === 0) {
    moveList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No content available to move to.</p>';
    return;
  }
  
  const beginningItem = createMoveItem('beginning', 'Move to beginning', '↑', 0, false);
  moveList.appendChild(beginningItem);
  
  const separator = document.createElement('div');
  separator.className = 'move-separator';
  moveList.appendChild(separator);
  
  canvasData.sections.forEach((section) => {
    const currentElementId = currentMoveElement ? currentMoveElement.dataset.id : null;
    if (currentElementId !== section.id) {
      const sectionItem = createMoveItem(section.id, section.name, section.icon, 0, false);
      moveList.appendChild(sectionItem);
    }
    
    if (section.content && section.content.length > 0) {
      section.content.forEach((item) => {
        if (currentElementId !== item.id) {
          const contentItem = createMoveItem(item.id, item.name, item.icon, 1, false);
          moveList.appendChild(contentItem);
        }
      });
    }
  });
}

function createMoveItem(id, name, icon, indentLevel, isDisabled) {
  const item = document.createElement('div');
  item.className = `move-item ${isDisabled ? 'disabled' : ''}`;
  if (indentLevel === 1) item.classList.add('move-item-indent');
  if (indentLevel === 2) item.classList.add('move-item-indent-2');
  
  item.innerHTML = `
    <div class="move-item-content">
      <span class="move-item-icon">${icon}</span>
      <span>${name}</span>
    </div>
  `;
  
  if (!isDisabled) {
    item.addEventListener('click', () => moveElementToPosition(id));
  }
  
  return item;
}

// FIXED: Move element to position
function moveElementToPosition(targetId) {
  if (!currentMoveElement) {
    console.error('No element selected for moving');
    return;
  }
  
  try {
    const elementData = getElementData(currentMoveElement);
    
    removeFromParentContent(currentMoveElement);
    const oldParent = currentMoveElement.parentElement;
    currentMoveElement.remove();
    
    if (oldParent && oldParent.classList.contains('section-content')) {
      if (oldParent.children.length === 0) {
        oldParent.classList.add('empty');
      }
    }
    
    if (targetId === 'beginning') {
      moveToBeginning();
    } else {
      moveAfterTargetElement(targetId, elementData);
    }
    
    saveCanvasData();
    closeMoveModal();
  } catch (error) {
    console.error('Error moving element:', error);
    alert('Failed to move element. Please try again.');
  }
}

function moveToBeginning() {
  if (currentMoveElement.classList.contains('canvas-section')) {
    const firstSection = canvasEl.querySelector('.canvas-section');
    if (firstSection) {
      canvasEl.insertBefore(currentMoveElement, firstSection);
    } else {
      canvasEl.insertBefore(currentMoveElement, canvasPlaceholder);
    }
    
    const elementId = currentMoveElement.dataset.id;
    const elementIndex = canvasData.sections.findIndex(s => s.id === elementId);
    if (elementIndex > -1) {
      const [element] = canvasData.sections.splice(elementIndex, 1);
      canvasData.sections.unshift(element);
    }
  } else {
    const firstSection = canvasEl.querySelector('.canvas-section:not(.special-section)');
    if (firstSection) {
      const sectionContent = firstSection.querySelector('.section-content');
      sectionContent.insertBefore(currentMoveElement, sectionContent.firstChild);
      sectionContent.classList.remove('empty');
      
      const sectionId = firstSection.dataset.id;
      const section = canvasData.sections.find(s => s.id === sectionId);
      if (section) {
        const elementData = getElementData(currentMoveElement);
        section.content.unshift(elementData);
      }
    }
  }
}

function moveAfterTargetElement(targetId, elementData) {
  const targetElement = findElementById(targetId);
  if (!targetElement) {
    console.error('Target element not found:', targetId);
    return;
  }
  
  if (targetElement.classList.contains('canvas-section')) {
    if (currentMoveElement.classList.contains('canvas-section')) {
      targetElement.parentNode.insertBefore(currentMoveElement, targetElement.nextSibling);
      updateSectionOrder();
    } else {
      const sectionContent = targetElement.querySelector('.section-content');
      sectionContent.appendChild(currentMoveElement);
      sectionContent.classList.remove('empty');
      
      const sectionId = targetElement.dataset.id;
      const section = canvasData.sections.find(s => s.id === sectionId);
      if (section) {
        section.content.push(elementData);
      }
    }
  } else if (targetElement.classList.contains('content-item')) {
    const parent = targetElement.parentElement;
    parent.insertBefore(currentMoveElement, targetElement.nextSibling);
    updateParentContentOrder(parent);
  }
}

function updateSectionOrder() {
  const sections = Array.from(canvasEl.querySelectorAll('.canvas-section'));
  const newOrder = [];
  
  sections.forEach(sectionEl => {
    const sectionId = sectionEl.dataset.id;
    const sectionData = canvasData.sections.find(s => s.id === sectionId);
    if (sectionData) {
      newOrder.push(sectionData);
    }
  });
  
  canvasData.sections = newOrder;
}

function updateParentContentOrder(parent) {
  if (parent.classList.contains('section-content')) {
    const sectionEl = parent.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    
    if (section) {
      const newOrder = [];
      Array.from(parent.children).forEach(child => {
        if (child.dataset.id) {
          const itemData = section.content.find(item => item.id === child.dataset.id);
          if (itemData) {
            newOrder.push(itemData);
          }
        }
      });
      section.content = newOrder;
    }
  }
}

function findElementById(id) {
  return document.querySelector(`[data-id="${id}"]`);
}

function closeMoveModal() {
  moveModal.classList.add('hidden');
  currentMoveElement = null;
}

// FIXED: Delete Functionality with Confirmation
function showDeleteConfirmation(element) {
  currentDeleteElement = element;
  const elementName = getCurrentDisplayName(element) || 'Unknown Item';
  
  document.getElementById('delete-item-name').textContent = elementName;
  deleteModal.classList.remove('hidden');
}

function confirmDelete() {
  if (!currentDeleteElement) {
    console.error('No element selected for deletion');
    return;
  }

  try {
    const elementId = currentDeleteElement.dataset.id;
    
    if (currentDeleteElement.classList.contains('canvas-section')) {
      canvasData.sections = canvasData.sections.filter(s => s.id !== elementId);
    } else {
      removeFromParentContent(currentDeleteElement);
    }
    
    currentDeleteElement.remove();
    saveCanvasData();
    clearSelection();
    
    if (canvasEl.children.length === 1) {
      canvasPlaceholder.style.display = 'flex';
    }
    
    closeDeleteModal();
  } catch (error) {
    console.error('Error deleting element:', error);
    alert('Failed to delete element. Please try again.');
  }
}

function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  currentDeleteElement = null;
}

function removeFromParentContent(element) {
  const elementId = element.dataset.id;
  const parentContentEl = element.parentElement;
  
  if (parentContentEl.classList.contains('section-content')) {
    const sectionEl = parentContentEl.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    if (section) {
      section.content = section.content.filter(item => item.id !== elementId);
    }
    
    if (parentContentEl.children.length === 1) {
      parentContentEl.classList.add('empty');
    }
  }
}

// Context Menu
function handleContextMenu(e) {
  const target = e.target.closest('.canvas-section, .content-item');
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

function editSelectedItem() {
  if (contextMenuTarget) {
    selectElement(contextMenuTarget);
  }
  hideContextMenu();
}

function deleteSelectedItem() {
  if (contextMenuTarget) {
    showDeleteConfirmation(contextMenuTarget);
  }
  hideContextMenu();
}

// Modal Handlers
function closeModal() {
  editModal.classList.add('hidden');
}

function saveItemEdit() {
  closeModal();
}

// Toolbar Functions
function saveCanvas() {
  saveCanvasData();
  alert('Canvas saved successfully!');
}

function clearCanvas() {
  if (confirm('Are you sure you want to clear the entire canvas? This action cannot be undone.')) {
    canvasData = { sections: [], customCounter: 0 };
    canvasEl.innerHTML = '';
    canvasEl.appendChild(canvasPlaceholder);
    canvasPlaceholder.style.display = 'flex';
    clearSelection();
    saveCanvasData();
  }
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
    
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = margin;
    
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('LMS Course Wireframe', margin, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;
    
    canvasData.sections.forEach((section) => {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(`${section.name}`, margin, yPosition);
      yPosition += 8;
      
      if (section.summaryForStudents) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const summaryLines = doc.splitTextToSize(`        Summary: ${section.summaryForStudents}`, pageWidth - margin * 2);
        doc.text(summaryLines, margin, yPosition);
        yPosition += 6 * summaryLines.length;
      }
      
      if (section.notesForDeveloper) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        const notesLines = doc.splitTextToSize(`        Developer Notes: ${section.notesForDeveloper}`, pageWidth - margin * 2);
        doc.text(notesLines, margin, yPosition);
        yPosition += 6 * notesLines.length;
      }
      
      yPosition += 5;
      
      doc.setDrawColor(33, 128, 141);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
      
      if (section.content && section.content.length > 0) {
        section.content.forEach((item) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = margin;
          }
          
          yPosition = renderContentItemWithIndentation(doc, item, margin, yPosition, pageHeight, pageWidth, 1);
        });
      } else {
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text('        (No content)', margin, yPosition);
        yPosition += 8;
      }
      
      yPosition += 15;
    });
    
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
      doc.text('Generated by LMS Wireframe Builder', margin, pageHeight - 10);
    }
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `lms-wireframe-${timestamp}.pdf`;
    
    doc.save(filename);
    document.body.classList.remove('exporting');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
    document.body.classList.remove('exporting');
  }
}

function renderContentItemWithIndentation(doc, item, baseMargin, y, pageHeight, pageWidth, indentLevel) {
  let yPosition = y;
  const indentSize = 8;
  const currentIndent = baseMargin + (indentLevel * indentSize);
  
  if (item.type === 'design-element') {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`--- ${item.name.toUpperCase()} ---`, currentIndent, yPosition);
    yPosition += 10;
  } else {
    const typeLabel = item.type === 'resource' ? 'RESOURCE' : 'ACTIVITY';
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`- ${item.name} (${typeLabel})`, currentIndent, yPosition);
    yPosition += 6;
    
    const contentIndent = baseMargin + ((indentLevel + 1) * indentSize);
    if (item.description) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const descLines = doc.splitTextToSize(`Description: ${item.description}`, pageWidth - contentIndent - baseMargin);
      doc.text(descLines, contentIndent, yPosition);
      yPosition += 6 * descLines.length;
    }
    
    if (item.approxLearningTime) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text(`Learning Time: ${item.approxLearningTime}`, contentIndent, yPosition);
      yPosition += 6;
    }
    
    yPosition += 3;
  }
  
  return yPosition;
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
  
  createContentInSection(itemData, sections[0]);
}

// Utility Functions
function generateId() {
  return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function saveCanvasData() {
  try {
    const dataString = JSON.stringify(canvasData);
    window.canvasDataBackup = dataString;
  } catch (e) {
    console.warn('Could not save canvas data:', e);
  }
}

function loadCanvasData() {
  try {
    if (window.canvasDataBackup) {
      canvasData = JSON.parse(window.canvasDataBackup);
      renderCanvas();
    }
  } catch (e) {
    console.warn('Could not load saved data:', e);
    canvasData = { sections: [], customCounter: 0 };
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
          <button class="control-btn" data-action="edit">✏️</button>
          <button class="control-btn" data-action="move">↕️</button>
          <button class="control-btn" data-action="delete">🗑️</button>
        </div>
      </div>
      <div class="section-content ${!sectionData.content || sectionData.content.length === 0 ? 'empty' : ''}"></div>
    `;

    const sectionContent = sectionEl.querySelector('.section-content');
    
    if (sectionData.content && sectionData.content.length > 0) {
      sectionData.content.forEach(contentData => {
        const contentEl = createContentElement(contentData);
        sectionContent.appendChild(contentEl);
      });
    }

    canvasEl.appendChild(sectionEl);
  });
  
  canvasEl.appendChild(canvasPlaceholder);
  canvasPlaceholder.style.display = 'none';
}