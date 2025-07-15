import React from 'react';
import MenuItemView from './MenuItemView';
import styles from '../../assets/styles/pages/owner/MenuManagePage.module.css';

const MenuListView = ({ menus, onEdit, onDelete, editMode, showButtons = true }) => (
  <div className={styles.menuListContainer}>
    {menus.length === 0 ? (
      <div className={styles.menuEmpty}>등록된 메뉴가 없습니다.</div>
    ) : (
      menus.map(menu => (
        <MenuItemView
          key={menu.menuId}
          menu={menu}
          onEdit={() => onEdit && onEdit(menu)}
          onDelete={() => onDelete && onDelete(menu.menuId)}
          disabled={!!editMode}
          showButtons={showButtons}
        />
      ))
    )}
  </div>
);

export default MenuListView;