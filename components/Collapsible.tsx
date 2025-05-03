import { PropsWithChildren, ReactNode, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';

export function Collapsible({ children, title, deleteElement }: PropsWithChildren & { title: string; deleteElement?: ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.heading}>
        <TouchableOpacity
          onPress={() => setIsOpen((value) => !value)}
          style={styles.headingLeft}
          activeOpacity={0.8}>
          <IconSymbol
            name="chevron.right"
            size={18}
            weight="medium"
            color="#4d4c4c"
            style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
            />
          <Text>{title}</Text>
        </TouchableOpacity>
        {deleteElement}
      </View>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
  headingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  }
});
